import Foundation

class LocalStore {
    static let shared = LocalStore()
    private let historyFile = "commit_history.json"
    private let compareCacheFile = "api_compare_cache.json"
    
    private var supportDir: URL {
        let paths = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)
        let dir = paths[0].appendingPathComponent("GitStat", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }
    
    // MARK: - Comparison Cache (Persistent)
    // Stores: push_id -> (commits, added, deleted)
    private var compareCache: [String: [Int]] = [:]
    
    init() {
        loadCompareCache()
    }
    
    private func loadCompareCache() {
        let url = supportDir.appendingPathComponent(compareCacheFile)
        if let data = try? Data(contentsOf: url),
           let decoded = try? JSONDecoder().decode([String: [Int]].self, from: data) {
            self.compareCache = decoded
        }
    }
    
    func getCachedCompare(for pushId: String) -> (Int, Int, Int)? {
        guard let vals = compareCache[pushId], vals.count == 3 else { return nil }
        return (vals[0], vals[1], vals[2])
    }
    
    func saveCachedCompare(pushId: String, commits: Int, added: Int, deleted: Int) {
        compareCache[pushId] = [commits, added, deleted]
        // Save periodically or after batch
        let url = supportDir.appendingPathComponent(compareCacheFile)
        if let data = try? JSONEncoder().encode(compareCache) {
            try? data.write(to: url, options: .atomic)
        }
    }

    // MARK: - History Ledger
    
    func savePushes(_ newPushes: [HistoricalPush]) {
        var existing = loadPushes()
        var updated = false
        
        for newPush in newPushes {
            if let index = existing.firstIndex(where: { $0.id == newPush.id }) {
                if existing[index].commits != newPush.commits || 
                   existing[index].linesAdded != newPush.linesAdded {
                    existing[index] = newPush
                    updated = true
                }
            } else {
                existing.append(newPush)
                updated = true
            }
        }
        
        if updated {
            // Keep 90 days
            let limit = Calendar.current.date(byAdding: .day, value: -90, to: Date()) ?? Date()
            existing = existing.filter { $0.date >= limit }
            
            if let data = try? JSONEncoder().encode(existing) {
                try? data.write(to: supportDir.appendingPathComponent(historyFile), options: .atomic)
            }
        }
    }
    
    func loadPushes() -> [HistoricalPush] {
        let url = supportDir.appendingPathComponent(historyFile)
        guard let data = try? Data(contentsOf: url),
              let pushes = try? JSONDecoder().decode([HistoricalPush].self, from: data) else {
            return []
        }
        return pushes
    }

    func getStats(for days: Int) -> CommitStats {
        let history = loadPushes()
        let now = Date()
        let cutoff: Date
        
        if days == 1 {
            cutoff = now.addingTimeInterval(-24 * 60 * 60)
        } else {
            let nDaysAgo = Calendar.current.date(byAdding: .day, value: -days, to: now) ?? now
            cutoff = Calendar.current.startOfDay(for: nDaysAgo)
        }
        
        let filtered = history.filter { $0.date >= cutoff }
        var stats = CommitStats()
        var uniqueRepos = Set<String>()
        var uniqueBranches = Set<String>()
        
        for push in filtered {
            stats.totalCommits += push.commits
            stats.linesAdded += push.linesAdded
            stats.linesDeleted += push.linesDeleted
            uniqueRepos.insert(push.repoName)
            uniqueBranches.insert("\(push.repoName):\(push.branchName)")
        }
        
        stats.reposCount = uniqueRepos.count
        stats.branchesCount = uniqueBranches.count
        stats.lastUpdated = Date()
        return stats
    }

    func getDailyStats(for days: Int) -> [DailyStat] {
        let history = loadPushes()
        let calendar = Calendar.current
        let now = Date()
        var dailyBuckets: [Date: DailyStat] = [:]
        
        for i in 0..<days {
            if let date = calendar.date(byAdding: .day, value: -i, to: now) {
                let normalizedDate = calendar.startOfDay(for: date)
                dailyBuckets[normalizedDate] = DailyStat(date: normalizedDate)
            }
        }
        
        for push in history {
            let normalizedDate = calendar.startOfDay(for: push.date)
            if var bucket = dailyBuckets[normalizedDate] {
                bucket.commits += push.commits
                bucket.additions += push.linesAdded
                bucket.deletions += push.linesDeleted
                bucket.repoNames.insert(push.repoName)
                bucket.branchKeys.insert("\(push.repoName):\(push.branchName)")
                bucket.projects = bucket.repoNames.count
                bucket.branches = bucket.branchKeys.count
                dailyBuckets[normalizedDate] = bucket
            }
        }
        return dailyBuckets.values.sorted { $0.date < $1.date }
    }
    
    func clearCache() {
        try? FileManager.default.removeItem(at: supportDir.appendingPathComponent(historyFile))
        try? FileManager.default.removeItem(at: supportDir.appendingPathComponent(compareCacheFile))
        compareCache.removeAll()
    }
    
    struct DailyStat: Identifiable {
        let id = UUID()
        let date: Date
        var commits: Int = 0
        var additions: Int = 0
        var deletions: Int = 0
        var projects: Int = 0
        var branches: Int = 0
        var repoNames: Set<String> = []
        var branchKeys: Set<String> = []
    }
}
