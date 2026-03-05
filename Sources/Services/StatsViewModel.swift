import Foundation
import Combine

enum TimeRange: Int, CaseIterable, Identifiable {
    case day24h = 1
    case week1w = 7
    case month1m = 30
    
    var id: Int { self.rawValue }
    var label: String {
        switch self {
        case .day24h: return "24H"
        case .week1w: return "1W"
        case .month1m: return "1M"
        }
    }
    
    // Ranges that support historical charting
    static var chartableRanges: [TimeRange] {
        return [.week1w, .month1m]
    }
}

enum ChartMetric: String, CaseIterable, Identifiable {
    case commits = "Commits"
    case additions = "Additions"
    case deletions = "Deletions"
    var id: String { self.rawValue }
}

enum ImportState {
    case idle
    case loading24h
    case backfilling
    case completed
}

class StatsViewModel: ObservableObject {
    @Published var stats: CommitStats = CommitStats()
    @Published var dailyStats: [LocalStore.DailyStat] = []
    @Published var selectedMetric: ChartMetric = .commits
    @Published var recentEvents: [GitHubEvent] = []
    @Published var isLoading: Bool = false
    @Published var importState: ImportState = .idle
    @Published var importProgress: Double = 0
    @Published var errorMessage: String?
    @Published var username: String = ""
    @Published var isAuthenticated: Bool = false
    @Published var userAvatar: String?
    @Published var selectedRange: TimeRange = .day24h {
        didSet {
            Task { @MainActor in
                updateStatsFromLocalStore()
            }
        }
    }
    
    private let apiService = GitHubAPIService.shared
    private let authService = GitHubAuthService.shared
    private let localStore = LocalStore.shared
    private var refreshTimer: Timer?
    private var currentFetchTask: Task<Void, Never>?
    
    init() {
        // Load saved username and avatar
        let savedUsername = UserDefaults.standard.string(forKey: "githubUsername") ?? ""
        let savedAvatar = UserDefaults.standard.string(forKey: "githubAvatar")
        
        self.username = savedUsername
        self.userAvatar = savedAvatar
        
        // Initial stats from local store needs to happen on MainActor
        Task { @MainActor in
            self.updateStatsFromLocalStore()
            
            // Check if already authenticated
            if KeychainManager.shared.getToken() != nil {
                self.isAuthenticated = true
                self.fetchProfileAndStats()
            }
        }
    }
    
    @MainActor
    private func updateStatsFromLocalStore() {
        self.stats = localStore.getStats(for: selectedRange.rawValue)
        self.dailyStats = localStore.getDailyStats(for: selectedRange.rawValue)
    }
    
    @MainActor
    func loginWithGitHub() {
        currentFetchTask?.cancel()
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let token = try await authService.login()
                _ = KeychainManager.shared.saveToken(token)
                self.isAuthenticated = true
                fetchProfileAndStats(firstRun: true)
            } catch {
                if !Task.isCancelled {
                    self.errorMessage = "Login failed: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
    
    @MainActor
    func logout() {
        currentFetchTask?.cancel()
        _ = KeychainManager.shared.deleteToken()
        self.isAuthenticated = false
        self.username = ""
        self.userAvatar = nil
        self.stats = CommitStats()
        self.recentEvents = []
        self.dailyStats = []
        UserDefaults.standard.removeObject(forKey: "githubUsername")
        UserDefaults.standard.removeObject(forKey: "githubAvatar")
        stopAutoRefresh()
    }
    
    @MainActor
    func fetchProfileAndStats(firstRun: Bool = false) {
        currentFetchTask?.cancel()
        isLoading = true
        errorMessage = nil
        
        currentFetchTask = Task {
            do {
                let profile = try await apiService.fetchUserProfile()
                if Task.isCancelled { return }
                
                self.username = profile.login
                self.userAvatar = profile.avatarUrl
                UserDefaults.standard.set(self.username, forKey: "githubUsername")
                UserDefaults.standard.set(self.userAvatar, forKey: "githubAvatar")
                
                await performFetchStats(allPages: firstRun)
                startAutoRefresh()
            } catch {
                if !Task.isCancelled {
                    self.errorMessage = "Failed to fetch profile: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
    
    @MainActor
    func fetchStats() {
        currentFetchTask?.cancel()
        currentFetchTask = Task {
            await performFetchStats()
        }
    }
    
    @MainActor
    private func performFetchStats(allPages: Bool = false) async {
        guard !username.isEmpty else {
            errorMessage = "Please set your GitHub username in Settings"
            return
        }
        
        isLoading = true
        importProgress = 0
        errorMessage = nil
        
        do {
            // PHASE 1: Fetch first page (last 24h usually)
            importState = .loading24h
            let firstPageEvents = try await apiService.fetchEvents(for: username, allPages: false)
            if Task.isCancelled { return }
            
            self.recentEvents = Array(firstPageEvents.prefix(10))
            let (new24hStats, initialHistoricalPushes) = await apiService.calculateStats(from: firstPageEvents)
            localStore.savePushes(initialHistoricalPushes)
            
            // Update UI immediately with fresh 24h data
            if selectedRange == .day24h {
                self.stats = new24hStats
                self.dailyStats = localStore.getDailyStats(for: 1)
            } else {
                updateStatsFromLocalStore()
            }
            
            // PHASE 2: Backfill history if requested
            if allPages {
                importState = .backfilling
                let allEvents = try await apiService.fetchEvents(for: username, allPages: true) { progress in
                    Task { @MainActor in
                        self.importProgress = progress
                    }
                }
                if Task.isCancelled { return }
                
                let (_, historicalPushes) = await apiService.calculateStats(from: allEvents)
                localStore.savePushes(historicalPushes)
                
                // Update UI again with full history
                updateStatsFromLocalStore()
            }
            
            if !Task.isCancelled {
                self.isLoading = false
                self.importState = .completed
                
                // Linger in completed state for 3 seconds
                try? await Task.sleep(nanoseconds: 3_000_000_000)
                
                if !Task.isCancelled {
                    self.importState = .idle
                }
            }
        } catch let error as GitHubAPIError {
            if !Task.isCancelled {
                self.errorMessage = error.errorDescription
                self.isLoading = false
                self.importState = .idle
            }
        } catch {
            if !Task.isCancelled {
                self.errorMessage = "Failed to fetch stats: \(error.localizedDescription)"
                self.isLoading = false
                self.importState = .idle
            }
        }
    }
    
    @MainActor
    func clearAllCache() {
        localStore.clearCache()
        self.stats = CommitStats()
        self.recentEvents = []
        self.dailyStats = []
        fetchStats()
    }
    
    func startAutoRefresh() {
        refreshTimer?.invalidate()
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 300, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.fetchStats()
            }
        }
    }
    
    func stopAutoRefresh() {
        refreshTimer?.invalidate()
        refreshTimer = nil
    }
}
