import Foundation

struct HistoricalPush: Codable, Identifiable {
    let id: String // GitHub event id
    let date: Date
    let repoName: String
    let branchName: String
    let commits: Int
    let linesAdded: Int
    let linesDeleted: Int
}

// MARK: - GitHub API Models

struct GitHubEvent: Codable, Identifiable {
    let id: String
    let type: String
    let createdAt: String
    let actor: GitHubActor
    let repo: GitHubRepo
    let payload: GitHubPayload?
    
    enum CodingKeys: String, CodingKey {
        case id, type, actor, repo, payload
        case createdAt = "created_at"
    }
}

struct GitHubPayload: Codable {
    let size: Int?
    let distinctSize: Int?
    let ref: String?
    let head: String?
    let before: String?
    
    enum CodingKeys: String, CodingKey {
        case size
        case distinctSize = "distinct_size"
        case ref
        case head
        case before
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        size = try? container.decodeIfPresent(Int.self, forKey: .size)
        distinctSize = try? container.decodeIfPresent(Int.self, forKey: .distinctSize)
        ref = try? container.decodeIfPresent(String.self, forKey: .ref)
        head = try? container.decodeIfPresent(String.self, forKey: .head)
        before = try? container.decodeIfPresent(String.self, forKey: .before)
    }
}

struct GitHubActor: Codable {
    let login: String
    let avatarUrl: String
    
    enum CodingKeys: String, CodingKey {
        case login
        case avatarUrl = "avatar_url"
    }
}

struct GitHubRepo: Codable {
    let id: Int
    let name: String
    let url: String
}

struct GitHubCompareResponse: Codable {
    let totalCommits: Int
    let files: [GitHubFile]?
    
    enum CodingKeys: String, CodingKey {
        case totalCommits = "total_commits"
        case files
    }
}

struct GitHubFile: Codable {
    let additions: Int
    let deletions: Int
    let changes: Int
}

// MARK: - Commit Stats Model

struct CommitStats {
    var totalCommits: Int = 0
    var linesAdded: Int = 0
    var linesDeleted: Int = 0
    var reposCount: Int = 0
    var branchesCount: Int = 0
    var lastUpdated: Date = Date()
}

// MARK: - GitHub API Error

enum GitHubAPIError: Error, LocalizedError {
    case invalidURL
    case networkError(Error)
    case invalidResponse
    case userNotFound
    case rateLimitExceeded
    
    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid URL"
        case .networkError(let error): return "Network error: \(error.localizedDescription)"
        case .invalidResponse: return "Invalid response from GitHub"
        case .userNotFound: return "GitHub user not found"
        case .rateLimitExceeded: return "GitHub API rate limit exceeded"
        }
    }
}

// MARK: - GitHub API Service (Actor)

actor GitHubAPIService {
    static let shared = GitHubAPIService()
    private let baseURL = "https://api.github.com"
    private let session: URLSession
    
    private var pushCache: [String: (commits: Int, added: Int, deleted: Int)] = [:]
    private let maxCacheSize = 100
    
    private init() {
        let config = URLSessionConfiguration.default
        config.requestCachePolicy = .returnCacheDataElseLoad
        self.session = URLSession(configuration: config)
    }
    
    private var accessToken: String? {
        KeychainManager.shared.getToken()
    }
    
    func fetchUserProfile() async throws -> GitHubActor {
        guard let url = URL(string: "\(baseURL)/user") else { throw GitHubAPIError.invalidURL }
        
        var request = URLRequest(url: url)
        request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
        request.setValue("GitStat/1.0", forHTTPHeaderField: "User-Agent")
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let (data, response) = try await session.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else { throw GitHubAPIError.invalidResponse }
        
        if httpResponse.statusCode == 200 {
            return try JSONDecoder().decode(GitHubActor.self, from: data)
        } else if httpResponse.statusCode == 401 {
            throw GitHubAPIError.rateLimitExceeded
        } else {
            throw GitHubAPIError.invalidResponse
        }
    }
    
    func fetchEvents(for username: String, allPages: Bool = false, progress: ((Double) -> Void)? = nil) async throws -> [GitHubEvent] {
        var allEvents: [GitHubEvent] = []
        let pages = allPages ? 3 : 1 

        for page in 1...pages {
            let urlString = "\(baseURL)/users/\(username)/events?per_page=100&page=\(page)"
            guard let url = URL(string: urlString) else { break }

            Logger.shared.log("API_REQUEST: \(urlString)")

            var request = URLRequest(url: url)
            request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
            request.setValue("GitStat/1.0", forHTTPHeaderField: "User-Agent")
            if let token = accessToken {
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            }

            let (data, response) = try await session.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { 
                Logger.shared.log("API_ERROR: Invalid response type", level: .error)
                break 
            }

            Logger.shared.log("API_RESPONSE: [\(httpResponse.statusCode)] for page \(page)")

            if httpResponse.statusCode == 200 {
                let events = try JSONDecoder().decode([GitHubEvent].self, from: data)
                allEvents.append(contentsOf: events)
                Logger.shared.log("API_DATA: Decoded \(events.count) events")
                progress?(Double(page) / Double(pages))
                if events.count < 100 { break }
            } else {
                Logger.shared.log("API_ERROR: Unexpected status code \(httpResponse.statusCode)", level: .error)
                break
            }
        }
        progress?(1.0)
        return allEvents
    }

    func fetchCompareData(repo: String, before: String, head: String) async -> (commits: Int, added: Int, deleted: Int) {
        let cacheKey = "\(repo)-\(before)-\(head)"
        if let cached = pushCache[cacheKey] {
            return cached
        }

        let isInitialPush = before.contains("00000000")
        let urlString = isInitialPush ? 
            "\(baseURL)/repos/\(repo)/commits/\(head)" : 
            "\(baseURL)/repos/\(repo)/compare/\(before)...\(head)"

        guard let url = URL(string: urlString) else { return (1, 0, 0) }

        Logger.shared.log("API_COMPARE_REQ: \(urlString)")

        var request = URLRequest(url: url)
        request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
        request.setValue("GitStat/1.0", forHTTPHeaderField: "User-Agent")
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        do {
            let (data, response) = try await session.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return (1, 0, 0) }

            Logger.shared.log("API_COMPARE_RES: [\(httpResponse.statusCode)]")

            if httpResponse.statusCode != 200 { return (1, 0, 0) }

            let result: (Int, Int, Int)
            let decoder = JSONDecoder()

            if isInitialPush {
                struct SingleCommit: Codable {
                    struct Stats: Codable { let additions: Int; let deletions: Int }
                    let stats: Stats?
                }
                let res = try decoder.decode(SingleCommit.self, from: data)
                result = (1, res.stats?.additions ?? 0, res.stats?.deletions ?? 0)
            } else {
                let res = try decoder.decode(GitHubCompareResponse.self, from: data)
                var added = 0
                var deleted = 0
                res.files?.forEach {
                    added += $0.additions
                    deleted += $0.deletions
                }
                result = (res.totalCommits, added, deleted)
            }

            Logger.shared.log("API_COMPARE_DATA: Commits=\(result.0), Add=\(result.1), Del=\(result.2)")

            if pushCache.count >= maxCacheSize {
                pushCache.removeValue(forKey: pushCache.keys.first!)
            }
            pushCache[cacheKey] = result
            return result
        } catch {
            Logger.shared.log("API_COMPARE_ERROR: \(error.localizedDescription)", level: .error)
            return (1, 0, 0)
        }
    }

    func calculateStats(from events: [GitHubEvent]) async -> (CommitStats, [HistoricalPush]) {
        Logger.shared.log("STATS_CALC: Processing \(events.count) events")

        let calendar = Calendar.current
        let twentyFourHoursAgo = calendar.date(byAdding: .hour, value: -24, to: Date()) ?? Date()

        var stats = CommitStats()
        var uniqueRepos = Set<Int>()
        var historicalPushes: [HistoricalPush] = []

        let dateFormatter = ISO8601DateFormatter()
        let fractionalFormatter = ISO8601DateFormatter()
        fractionalFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        for event in events {
            guard let eventDate = fractionalFormatter.date(from: event.createdAt) ?? dateFormatter.date(from: event.createdAt) else { continue }

            if event.type == "PushEvent", 
               let head = event.payload?.head, 
               let before = event.payload?.before {

                let (commits, added, deleted) = await self.fetchCompareData(repo: event.repo.name, before: before, head: head)

                let push = HistoricalPush(
                    id: event.id,
                    date: eventDate,
                    repoName: event.repo.name,
                    branchName: event.payload?.ref?.replacingOccurrences(of: "refs/heads/", with: "") ?? "unknown",
                    commits: commits,
                    linesAdded: added,
                    linesDeleted: deleted
                )

                historicalPushes.append(push)

                if eventDate >= twentyFourHoursAgo {
                    stats.totalCommits += commits
                    stats.linesAdded += added
                    stats.linesDeleted += deleted
                    uniqueRepos.insert(event.repo.id)
                }
            }
        }

        var uniqueBranches = Set<String>()
        for push in historicalPushes where push.date >= twentyFourHoursAgo {
            uniqueBranches.insert("\(push.repoName):\(push.branchName)")
        }

        stats.reposCount = uniqueRepos.count
        stats.branchesCount = uniqueBranches.count
        stats.lastUpdated = Date()

        Logger.shared.log("STATS_RESULT: 24h Commits=\(stats.totalCommits), Added=\(stats.linesAdded), Deleted=\(stats.linesDeleted)")
        return (stats, historicalPushes)
    }

}
