import Foundation
import Combine

class StatsViewModel: ObservableObject {
    @Published var stats: CommitStats = CommitStats()
    @Published var recentEvents: [GitHubEvent] = []
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var username: String = ""
    @Published var isAuthenticated: Bool = false
    @Published var userAvatar: String?
    
    private let apiService = GitHubAPIService.shared
    private let authService = GitHubAuthService.shared
    private var refreshTimer: Timer?
    private var currentFetchTask: Task<Void, Never>?
    
    init() {
        // Load saved username and avatar
        username = UserDefaults.standard.string(forKey: "githubUsername") ?? ""
        userAvatar = UserDefaults.standard.string(forKey: "githubAvatar")
        
        // Check if already authenticated
        if KeychainManager.shared.getToken() != nil {
            isAuthenticated = true
            fetchProfileAndStats()
        }
    }
    
    var hasUsername: Bool {
        !username.isEmpty
    }
    
    func loginWithGitHub() {
        currentFetchTask?.cancel()
        isLoading = true
        errorMessage = nil
        
        Task { @MainActor in
            do {
                let token = try await authService.login()
                _ = KeychainManager.shared.saveToken(token)
                self.isAuthenticated = true
                fetchProfileAndStats()
            } catch {
                if !Task.isCancelled {
                    self.errorMessage = "Login failed: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
    
    func logout() {
        currentFetchTask?.cancel()
        _ = KeychainManager.shared.deleteToken()
        self.isAuthenticated = false
        self.username = ""
        self.userAvatar = nil
        self.stats = CommitStats()
        self.recentEvents = []
        UserDefaults.standard.removeObject(forKey: "githubUsername")
        stopAutoRefresh()
    }
    
    func fetchProfileAndStats() {
        currentFetchTask?.cancel()
        isLoading = true
        errorMessage = nil
        
        currentFetchTask = Task { @MainActor in
            do {
                let profile = try await apiService.fetchUserProfile()
                if Task.isCancelled { return }
                
                self.username = profile.login
                self.userAvatar = profile.avatarUrl
                UserDefaults.standard.set(self.username, forKey: "githubUsername")
                UserDefaults.standard.set(self.userAvatar, forKey: "githubAvatar")
                
                await performFetchStats()
                startAutoRefresh()
            } catch {
                if !Task.isCancelled {
                    self.errorMessage = "Failed to fetch profile: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
    
    func fetchStats() {
        currentFetchTask?.cancel()
        currentFetchTask = Task { @MainActor in
            await performFetchStats()
        }
    }
    
    private func performFetchStats() async {
        guard !username.isEmpty else {
            errorMessage = "Please set your GitHub username in Settings"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let events = try await apiService.fetchEvents(for: username)
            if Task.isCancelled { return }
            
            self.recentEvents = Array(events.prefix(10)) 
            let newStats = await apiService.calculateStats(from: events)
            
            if !Task.isCancelled {
                self.stats = newStats
                self.isLoading = false
            }
        } catch let error as GitHubAPIError {
            if !Task.isCancelled {
                self.errorMessage = error.errorDescription
                self.isLoading = false
            }
        } catch {
            if !Task.isCancelled {
                self.errorMessage = "Failed to fetch stats: \(error.localizedDescription)"
                self.isLoading = false
            }
        }
    }
    
    func startAutoRefresh() {
        refreshTimer?.invalidate()
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 300, repeats: true) { [weak self] _ in
            self?.fetchStats()
        }
    }
    
    func stopAutoRefresh() {
        refreshTimer?.invalidate()
        refreshTimer = nil
    }
}
