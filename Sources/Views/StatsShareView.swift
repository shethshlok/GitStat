import SwiftUI

struct StatsShareView: View {
    let stats: CommitStats
    let username: String
    let avatarImage: NSImage?
    let range: TimeRange
    
    // Supporting data
    private let stats24h = LocalStore.shared.getStats(for: 1)
    private let stats1w = LocalStore.shared.getStats(for: 7)
    private let stats1m = LocalStore.shared.getStats(for: 30)
    
    var body: some View {
        ZStack {
            // Base Layer: Deep technical background
            Color.black.ignoresSafeArea()
            
            // Decorative Mesh Glow
            RadialGradient(
                colors: [Color.blue.opacity(0.15), Color.clear],
                center: .topTrailing,
                startRadius: 100,
                endRadius: 600
            ).ignoresSafeArea()
            
            RadialGradient(
                colors: [Color.green.opacity(0.1), Color.clear],
                center: .bottomLeading,
                startRadius: 100,
                endRadius: 500
            ).ignoresSafeArea()
            
            // Subtle Grid Overlay
            gridPattern
                .opacity(0.05)
            
            // Large Watermark Logo
            Image("MenuBarIcon")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 400, height: 400)
                .opacity(0.02)
                .offset(x: 200, y: -100)
            
            VStack(spacing: 0) {
                // 1. Identity Header
                HStack(spacing: 20) {
                    if let nsImage = avatarImage {
                        Image(nsImage: nsImage)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 70, height: 70)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.white.opacity(0.1), lineWidth: 2))
                    }
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(username)
                            .font(.system(size: 28, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        Text("github.com/\(username)")
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 4) {
                        Text("GITSTAT_REPORT")
                            .font(.system(size: 10, weight: .black, design: .monospaced))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.green.opacity(0.2))
                            .foregroundColor(.green)
                            .cornerRadius(4)
                        
                        Text(Date().formatted(date: .abbreviated, time: .omitted).uppercased())
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.bottom, 40)
                
                // 2. HERO SECTION: LAST 24 HOURS (Primary Highlight)
                VStack(alignment: .leading, spacing: 24) {
                    Text("CURRENT_VELOCITY (24H)")
                        .font(.system(size: 10, weight: .black, design: .monospaced))
                        .foregroundColor(.green.opacity(0.8))
                    
                    HStack(spacing: 0) {
                        heroMetric(label: "COMMITS", value: "\(stats24h.totalCommits)", color: .white)
                        Spacer()
                        heroMetric(label: "ADDITIONS", value: "+\(formatNumber(stats24h.linesAdded))", color: .green)
                        Spacer()
                        heroMetric(label: "DELETIONS", value: "-\(formatNumber(stats24h.linesDeleted))", color: .red)
                    }
                    
                    // Code Ratio Bar for 24h
                    ZStack(alignment: .leading) {
                        Capsule().fill(Color.white.opacity(0.05))
                        let added = Double(stats24h.linesAdded)
                        let deleted = Double(stats24h.linesDeleted)
                        let total = added + deleted
                        if total > 0 {
                            HStack(spacing: 2) {
                                Capsule().fill(Color.green).frame(width: 800 * (added/total))
                                Capsule().fill(Color.red).frame(width: 800 * (deleted/total))
                            }
                        }
                    }
                    .frame(height: 8)
                }
                .padding(40)
                .background(Color.white.opacity(0.03))
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.white.opacity(0.05), lineWidth: 1))
                .padding(.bottom, 30)
                
                // 3. TRENDS SECTION: 1W & 1M (Contextual Data)
                HStack(spacing: 20) {
                    trendCard(title: "WEEKLY_TOTAL", stats: stats1w, color: .blue)
                    trendCard(title: "MONTHLY_TOTAL", stats: stats1m, color: .purple)
                }
                
                Spacer()
                
                // 4. Footer Branding
                HStack {
                    Image("MenuBarIcon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 18, height: 18)
                        .opacity(0.4)
                    
                    Text("GENERATED_BY_GITSTAT")
                        .font(.system(size: 10, weight: .black, design: .monospaced))
                        .foregroundColor(.white.opacity(0.3))
                    
                    Spacer()
                    
                    Text("INDEXED_PROJECTS: \(stats1m.reposCount)")
                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                        .foregroundColor(.secondary)
                }
                .padding(.top, 40)
            }
            .padding(60)
        }
        .frame(width: 1000, height: 800)
    }
    
    // MARK: - Subviews
    
    private func heroMetric(label: String, value: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(.secondary)
            Text(value)
                .font(.system(size: 64, weight: .black, design: .monospaced))
                .foregroundColor(color)
        }
    }
    
    private func trendCard(title: String, stats: CommitStats, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.system(size: 10, weight: .black, design: .monospaced))
                .foregroundColor(color.opacity(0.8))
            
            HStack(alignment: .bottom, spacing: 4) {
                Text("\(stats.totalCommits)")
                    .font(.system(size: 32, weight: .bold, design: .monospaced))
                    .foregroundColor(.white)
                Text("commits")
                    .font(.system(size: 10, weight: .medium, design: .monospaced))
                    .foregroundColor(.secondary)
                    .padding(.bottom, 6)
            }
            
            HStack(spacing: 12) {
                Text("+\(formatNumber(stats.linesAdded))")
                    .foregroundColor(.green)
                Text("-\(formatNumber(stats.linesDeleted))")
                    .foregroundColor(.red)
            }
            .font(.system(size: 12, weight: .bold, design: .monospaced))
        }
        .padding(24)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(color.opacity(0.05))
        .cornerRadius(16)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(color.opacity(0.1), lineWidth: 1))
    }
    
    private var gridPattern: some View {
        GeometryReader { geo in
            Path { path in
                let spacing: CGFloat = 50
                for i in 0...Int(geo.size.width / spacing) {
                    let x = CGFloat(i) * spacing
                    path.move(to: CGPoint(x: x, y: 0))
                    path.addLine(to: CGPoint(x: x, y: geo.size.height))
                }
                for i in 0...Int(geo.size.height / spacing) {
                    let y = CGFloat(i) * spacing
                    path.move(to: CGPoint(x: 0, y: y))
                    path.addLine(to: CGPoint(x: geo.size.width, y: y))
                }
            }
            .stroke(Color.white, lineWidth: 0.3)
        }
    }
    
    private func formatNumber(_ number: Int) -> String {
        let absNum = abs(number)
        if absNum >= 1000000 {
            return String(format: "%.1fM", Double(absNum) / 1000000.0)
        } else if absNum >= 1000 {
            return String(format: "%.1fK", Double(absNum) / 1000.0)
        }
        return "\(absNum)"
    }
}
