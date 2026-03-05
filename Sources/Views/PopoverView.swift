import SwiftUI

struct PopoverView: View {
    @EnvironmentObject var statsViewModel: StatsViewModel
    @State private var isHoveringRefresh = false
    @State private var hoveredStat: String? = nil
    
    var body: some View {
        VStack(spacing: 0) {
            headerView
            
            Divider().opacity(0.5)
            
            ZStack {
                VisualEffectView(material: .popover, blendingMode: .withinWindow)
                    .ignoresSafeArea()
                
                if !statsViewModel.isAuthenticated {
                    noUsernameView
                } else if statsViewModel.isLoading && statsViewModel.stats.totalCommits == 0 {

                    loadingView
                } else if let error = statsViewModel.errorMessage {
                    errorView(message: error)
                } else {
                    mainContentView
                }
            }
            
            Divider().opacity(0.5)
            
            footerView
        }
        .frame(width: 320, height: 480)
        .onAppear {
            statsViewModel.startAutoRefresh()
            if statsViewModel.isAuthenticated && statsViewModel.stats.totalCommits == 0 {
                statsViewModel.fetchStats()
            }
        }
        .onDisappear {
            statsViewModel.stopAutoRefresh()
        }
    }
    
    // MARK: - Components
    
    private var headerView: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                if let avatarUrl = statsViewModel.userAvatar, let url = URL(string: avatarUrl) {
                    AsyncImage(url: url) { image in
                        image.resizable()
                             .aspectRatio(contentMode: .fit)
                             .frame(width: 24, height: 24)
                             .clipShape(Circle())
                             .overlay(Circle().stroke(Color.primary.opacity(0.1), lineWidth: 1))
                    } placeholder: {
                        Circle().fill(Color.secondary.opacity(0.2)).frame(width: 24, height: 24)
                    }
                } else {
                    Image(systemName: "terminal.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.green)
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    Text(statsViewModel.isAuthenticated ? statsViewModel.username : "GitStat")
                        .font(.system(size: 13, weight: .bold, design: .monospaced))
                    
                    if statsViewModel.isAuthenticated {
                        Picker("", selection: $statsViewModel.selectedRange) {
                            ForEach(TimeRange.allCases) { range in
                                Text(range.label).tag(range)
                            }
                        }
                        .pickerStyle(.segmented)
                        .labelsHidden()
                        .controlSize(.small)
                        .frame(width: 120)
                    }
                }
                
                Spacer()
                
                refreshButton
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            
            if statsViewModel.importState != .idle {
                VStack(spacing: 0) {
                    if statsViewModel.importState == .completed {
                        HStack(spacing: 4) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 8))
                            Text("SYNC_COMPLETE")
                                .font(.system(size: 7, weight: .bold, design: .monospaced))
                        }
                        .foregroundColor(.green)
                        .padding(.vertical, 4)
                    } else {
                        ProgressView(value: statsViewModel.importState == .backfilling ? statsViewModel.importProgress : nil)
                            .progressViewStyle(.linear)
                            .controlSize(.small)
                            .scaleEffect(x: 1, y: 0.5, anchor: .center)
                        
                        Text(statsViewModel.importState == .backfilling ? "BACKFILLING_HISTORY..." : "SYNCING_24H...")
                            .font(.system(size: 7, weight: .bold, design: .monospaced))
                            .foregroundColor(.orange)
                            .padding(.vertical, 2)
                    }
                }
                .frame(maxWidth: .infinity)
                .background(statsViewModel.importState == .completed ? Color.green.opacity(0.05) : Color.clear)
                .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
    }
    
    private var refreshButton: some View {
        Button(action: {
            statsViewModel.fetchStats()
        }) {
            ZStack {
                if statsViewModel.isLoading {
                    ProgressView()
                        .controlSize(.small)
                        .scaleEffect(0.5)
                } else {
                    Image(systemName: "arrow.clockwise")
                        .font(.system(size: 11, weight: .bold))
                        .rotationEffect(.degrees(isHoveringRefresh ? 30 : 0))
                }
            }
            .frame(width: 24, height: 24)
            .background(Color.primary.opacity(isHoveringRefresh ? 0.08 : 0))
            .cornerRadius(6)
        }
        .buttonStyle(.plain)
        .onHover { isHoveringRefresh = $0 }
        .animation(.spring(response: 0.3), value: isHoveringRefresh)
    }
    
    private var mainContentView: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 20) {
                // Hero Stats
                VStack(spacing: 16) {
                    HStack(alignment: .bottom) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("COMMITS")
                                .font(.system(size: 10, weight: .black))
                                .foregroundColor(.secondary)
                            
                            Text("\(statsViewModel.stats.totalCommits)")
                                .font(.system(size: 42, weight: .bold, design: .monospaced))
                                .foregroundColor(.primary)
                        }
                        
                        Spacer()
                        
                        VStack(alignment: .trailing, spacing: 4) {
                            HStack(spacing: 4) {
                                Image(systemName: "arrow.triangle.branch")
                                Text("\(statsViewModel.stats.branchesCount) branches")
                            }
                            .font(.system(size: 11, weight: .medium, design: .monospaced))
                            .foregroundColor(.secondary)
                            
                            HStack(spacing: 4) {
                                Image(systemName: "folder")
                                Text("\(statsViewModel.stats.reposCount) projects")
                            }
                            .font(.system(size: 11, weight: .medium, design: .monospaced))
                            .foregroundColor(.secondary)
                        }
                        .padding(.bottom, 6)
                    }
                    .animation(.easeInOut, value: statsViewModel.stats.totalCommits)
                    
                    // Compact Line Metrics
                    HStack(spacing: 12) {
                        metricTag(label: "ADD", value: "+\(formatNumber(statsViewModel.stats.linesAdded))", color: .green)
                        metricTag(label: "DEL", value: "-\(formatNumber(statsViewModel.stats.linesDeleted))", color: .red)
                        
                        let net = statsViewModel.stats.linesAdded - statsViewModel.stats.linesDeleted
                        metricTag(label: "NET", value: (net >= 0 ? "+" : "") + formatNumber(net), color: .blue)
                    }
                    .animation(.easeInOut, value: statsViewModel.stats.linesAdded)
                }
                .padding(.horizontal, 16)
                
                // Pulse Chart (Simulated minimalist bar)
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.primary.opacity(0.05))
                    
                    let added = Double(statsViewModel.stats.linesAdded)
                    let deleted = Double(statsViewModel.stats.linesDeleted)
                    let total = added + deleted
                    
                    if total > 0 {
                        HStack(spacing: 2) {
                            Capsule()
                                .fill(Color.green.opacity(0.8))
                                .frame(width: max(0, 288 * (added / total)))
                            
                            Capsule()
                                .fill(Color.red.opacity(0.8))
                                .frame(width: max(0, 288 * (deleted / total)))
                        }
                    }
                }
                .frame(height: 6)
                .padding(.horizontal, 16)
                .animation(.spring(), value: statsViewModel.stats.linesAdded)
                
                // Activity Log
                VStack(alignment: .leading, spacing: 12) {
                    Text("ACTIVITY_LOG")
                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 16)
                    
                    if statsViewModel.recentEvents.isEmpty {
                        Text("No data packet received.")
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 16)
                    } else {
                        VStack(spacing: 1) {
                            ForEach(statsViewModel.recentEvents.prefix(6)) { event in
                                eventRow(event)
                            }
                        }
                    }
                }
            }
            .padding(.vertical, 16)
        }
    }
    
    private func metricTag(label: String, value: String, color: Color) -> some View {
        HStack(spacing: 6) {
            Text(label)
                .font(.system(size: 8, weight: .bold))
                .foregroundColor(color.opacity(0.8))
                .padding(.horizontal, 4)
                .padding(.vertical, 2)
                .background(color.opacity(0.1))
                .cornerRadius(3)
            
            Text(value)
                .font(.system(size: 12, weight: .bold, design: .monospaced))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
    
    private func eventRow(_ event: GitHubEvent) -> some View {
        HStack(spacing: 12) {
            Circle()
                .fill(activityColor(for: event.type))
                .frame(width: 4, height: 4)
            
            Text(event.type.replacingOccurrences(of: "Event", with: "").uppercased())
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .frame(width: 45, alignment: .leading)
            
            Text(event.repo.name.split(separator: "/").last ?? "")
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(.primary.opacity(0.8))
                .lineLimit(1)
            
            Spacer()
            
            Text(timeAgo(from: event.createdAt))
                .font(.system(size: 9, design: .monospaced))
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(hoveredStat == event.id ? Color.primary.opacity(0.04) : Color.clear)
        .onHover { isHovered in
            hoveredStat = isHovered ? event.id : nil
        }
    }
    
    private func activityColor(for type: String) -> Color {
        switch type {
        case "PushEvent": return .green
        case "PullRequestEvent": return .blue
        case "IssuesEvent": return .orange
        case "CreateEvent": return .purple
        default: return .secondary
        }
    }
    
    private var footerView: some View {
        HStack {
            Text("v1.0.2 // STABLE")
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(.secondary.opacity(0.5))
            
            Spacer()
            
            HStack(spacing: 12) {
                Text(formattedDate(statsViewModel.stats.lastUpdated))
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(.secondary)
                
                if #available(macOS 14.0, *) {
                    SettingsLink {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 10))
                            .foregroundColor(.secondary)
                    }
                    .buttonStyle(.plain)
                } else {
                    Button(action: openSettings) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 10))
                            .foregroundColor(.secondary)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.primary.opacity(0.02))
    }
    
    // MARK: - Helpers

    private func openSettings() {
        if #available(macOS 14.0, *) {
            // Native SwiftUI 4+ Settings handling is usually via SettingsLink, 
            // but for a button action we use the standard NSApp selector
            NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
        } else {
            NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
        }
        NSApp.activate(ignoringOtherApps: true)
    }
    
    private func formatNumber(_ number: Int) -> String {
        let absNum = abs(number)
        if absNum >= 1000000 {
            return String(format: "%.1fM", Double(absNum) / 1000000)
        } else if absNum >= 1000 {
            return String(format: "%.1fK", Double(absNum) / 1000)
        }
        return "\(absNum)"
    }
    
    private func formattedDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        return formatter.string(from: date)
    }
    
    private func timeAgo(from dateString: String) -> String {
        let dateFormatter = ISO8601DateFormatter()
        let fractionalFormatter = ISO8601DateFormatter()
        fractionalFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let date = fractionalFormatter.date(from: dateString) ?? dateFormatter.date(from: dateString) else { return "" }
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
    
    private var noUsernameView: some View {
        VStack(spacing: 20) {
            Image(systemName: "command")
                .font(.system(size: 40))
                .foregroundColor(.secondary.opacity(0.3))
            
            VStack(spacing: 8) {
                Text("Connection Required")
                    .font(.system(size: 16, weight: .bold, design: .monospaced))
                Text("Authenticate to sync data packets.")
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
            }
            
            Button(action: { statsViewModel.loginWithGitHub() }) {
                Text("LOGIN_WITH_GITHUB")
                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .background(Color.primary)
                    .foregroundColor(.white)
                    .cornerRadius(4)
            }
            .buttonStyle(.plain)
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 12) {
            ProgressView()
                .controlSize(.small)
            Text("STREAMING_DATA...")
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(.secondary)
        }
    }
    
    private func errorView(message: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "terminal")
                .foregroundColor(.red)
            Text("ERROR: \(message)")
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(.red)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
        }
    }
}

struct VisualEffectView: NSViewRepresentable {
    let material: NSVisualEffectView.Material
    let blendingMode: NSVisualEffectView.BlendingMode
    func makeNSView(context: Context) -> NSVisualEffectView {
        let view = NSVisualEffectView()
        view.material = material
        view.blendingMode = blendingMode
        view.state = .followsWindowActiveState
        return view
    }
    func updateNSView(_ nsView: NSVisualEffectView, context: Context) {
        nsView.material = material
        nsView.blendingMode = blendingMode
    }
}
