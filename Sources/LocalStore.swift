import Foundation

class LocalStore {
    static let shared = LocalStore()
    private let fileName = "commit_history.json"
    
    private var fileURL: URL {
        let paths = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)
        let supportDir = paths[0].appendingPathComponent("GitStat", isDirectory: true)
        try? FileManager.default.createDirectory(at: supportDir, withIntermediateDirectories: true)
        return supportDir.appendingPathComponent(fileName)
    }
    
    func savePushes(_ newPushes: [HistoricalPush]) {
        var existing = loadPushes()
        let existingIds = Set(existing.map { $0.id })
        
        let uniqueNew = newPushes.filter { !existingIds.contains($0.id) }
        
        if uniqueNew.isEmpty {
            Logger.shared.log("STORE: No new pushes to save.")
            return
        }
        
        existing.append(contentsOf: uniqueNew)
        
        // Keep last 90 days
        let ninetyDaysAgo = Calendar.current.date(byAdding: .day, value: -90, to: Date()) ?? Date()
        existing = existing.filter { $0.date >= ninetyDaysAgo }
        
        do {
            let data = try JSONEncoder().encode(existing)
            try data.write(to: fileURL, options: .atomic)
            Logger.shared.log("STORE: Successfully saved \(uniqueNew.count) new pushes. Total in ledger: \(existing.count)")
        } catch {
            Logger.shared.log("STORE_ERROR: Failed to save ledger: \(error.localizedDescription)", level: .error)
        }
    }
    
    func loadPushes() -> [HistoricalPush] {
        if !FileManager.default.fileExists(atPath: fileURL.path) {
            return []
        }
        
        do {
            let data = try Data(contentsOf: fileURL)
            let pushes = try JSONDecoder().decode([HistoricalPush].self, from: data)
            return pushes
        } catch {
            Logger.shared.log("STORE_WARNING: Ledger decoding failed (possibly old format). Resetting... \(error.localizedDescription)", level: .debug)
            // If decoding fails (e.g. format change), we return empty to start fresh 
            // rather than crashing or showing garbage.
            return []
        }
    }

    func getStats(for days: Int) -> CommitStats {
        let history = loadPushes()
        let now = Date()
        
        let cutoff: Date
        if days == 1 {
            // Exactly 24 hours ago (sliding window)
            cutoff = now.addingTimeInterval(-24 * 60 * 60)
        } else {
            // Start of day N days ago (calendar days)
            let calendar = Calendar.current
            let nDaysAgo = calendar.date(byAdding: .day, value: -days, to: now) ?? now
            cutoff = calendar.startOfDay(for: nDaysAgo)
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
        
        Logger.shared.log("STORE_STATS: Aggregated \(filtered.count) pushes for range \(days)d. Additions: \(stats.linesAdded)")
        return stats
    }

    func getDailyStats(for days: Int) -> [DailyStat] {
        let history = loadPushes()
        let calendar = Calendar.current
        let now = Date()
        
        var dailyBuckets: [Date: DailyStat] = [:]
        // Use calendar days for the buckets
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
        try? FileManager.default.removeItem(at: fileURL)
        Logger.shared.log("STORE: Cache cleared successfully.")
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
