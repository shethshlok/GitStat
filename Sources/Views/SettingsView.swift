import SwiftUI
import Charts

struct SettingsView: View {
    @EnvironmentObject var statsViewModel: StatsViewModel
    @State private var showingAlert: Bool = false
    @State private var showingClearConfirmation: Bool = false
    @State private var alertMessage: String = ""
    @State private var hoveredDate: Date?
    
    var body: some View {
        TabView {
            generalTab
                .tabItem {
                    Label("General", systemImage: "gearshape")
                }
            
            analyticsTab
                .tabItem {
                    Label("Analytics", systemImage: "chart.bar.xaxis")
                }
        }
        .frame(width: 500, height: 420)
        .alert("Error", isPresented: $showingAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(alertMessage)
        }
        .alert("Clear Cache?", isPresented: $showingClearConfirmation) {
            Button("Clear Everything", role: .destructive) {
                statsViewModel.clearAllCache()
            }
            Button("Cancel", role: .cancel) { }
        } message: {
            Text("This will delete your local historical ledger. Your data will be re-synced from GitHub (up to 300 events).")
        }
        .onChange(of: statsViewModel.errorMessage) { newValue in
            if let error = newValue {
                alertMessage = error
                showingAlert = true
            }
        }
    }
    
    // MARK: - Tabs
    
    private var generalTab: some View {
        VStack(spacing: 0) {
            Form {
                Section("GitHub Account") {
                    if statsViewModel.isAuthenticated {
                        authenticatedUserRow
                    } else {
                        loginButton
                    }
                }
                
                Section("Display Preferences") {
                    Toggle("Show stats in menu bar", isOn: $statsViewModel.showActivityInMenuBar)
                    Text("Displays your current commits and line counts next to the menu bar icon.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Toggle("Show activity log in main view", isOn: $statsViewModel.showActivityLog)
                    Text("Shows the detailed list of recent GitHub events in the main popover.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Section("Data Management") {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Local Historical Ledger")
                                .font(.body)
                            Text("\(statsViewModel.stats.totalCommits) commits // \(statsViewModel.stats.reposCount) projects indexed.")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        Button("Clear Cache...") {
                            showingClearConfirmation = true
                        }
                    }
                }
            }
            .formStyle(.grouped)
            
            Divider()
            
            HStack {
                Text("v1.0.2 // STABLE")
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundColor(.secondary.opacity(0.5))
                Spacer()
                Button("Done") {
                    NSApp.sendAction(#selector(NSWindow.performClose(_:)), to: nil, from: nil)
                }
                .keyboardShortcut(.defaultAction)
            }
            .padding()
            .background(Color(nsColor: .windowBackgroundColor))
        }
    }
    
    private var analyticsTab: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    HStack {
                        Text("Usage Trends")
                            .font(.headline)
                        Spacer()
                        
                        if statsViewModel.selectedRange == .custom {
                            Stepper(value: $statsViewModel.customDays, in: 2...90) {
                                Text("\(statsViewModel.customDays) days")
                                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                            }
                            .controlSize(.small)
                            .padding(.trailing, 8)
                        }
                        
                        Picker("", selection: $statsViewModel.selectedRange) {
                            ForEach(TimeRange.chartableRanges) { range in
                                Text(range.label).tag(range)
                            }
                        }
                        .pickerStyle(.segmented)
                        .controlSize(.small)
                        .frame(width: 140)
                    }
                    .onAppear {
                        // Default to 1W when viewing trends
                        if statsViewModel.selectedRange == .day24h {
                            statsViewModel.selectedRange = .week1w
                        }
                    }
                    
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            Picker("Metric", selection: $statsViewModel.selectedMetric) {
                                ForEach(ChartMetric.allCases) { metric in
                                    Text(metric.rawValue).tag(metric)
                                }
                            }
                            .labelsHidden()
                            .pickerStyle(.segmented)
                            .controlSize(.small)
                            .frame(width: 220)
                            
                            Spacer()
                            
                            // Fixed-width container for hover info
                            HStack(spacing: 12) {
                                if let hoveredDate = hoveredDate,
                                   let stat = statsViewModel.dailyStats.first(where: { Calendar.current.isDate($0.date, inSameDayAs: hoveredDate) }) {
                                    chartValueLabel(label: "VALUE", value: "\(metricValue(for: stat))")
                                    chartValueLabel(label: "DATE", value: formatDateShort(hoveredDate))
                                } else {
                                    chartValueLabel(label: "VALUE", value: "--").opacity(0)
                                    chartValueLabel(label: "DATE", value: "--- --").opacity(0)
                                }
                            }
                            .frame(width: 100, alignment: .trailing)
                        }
                        
                        chartView
                            .frame(height: 180)
                    }
                    .padding()
                    .background(Color(nsColor: .controlBackgroundColor))
                    .cornerRadius(12)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.primary.opacity(0.05), lineWidth: 1))
                    
                    Text("Analytics are aggregated daily from your local historical ledger. Sync full history to update deeper trends.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(24)
            }
            
            Divider()
            
            HStack {
                Spacer()
                Button("Done") {
                    NSApp.sendAction(#selector(NSWindow.performClose(_:)), to: nil, from: nil)
                }
                .keyboardShortcut(.defaultAction)
            }
            .padding()
            .background(Color(nsColor: .windowBackgroundColor))
        }
    }
    
    // MARK: - Components
    
    private var authenticatedUserRow: some View {
        HStack(spacing: 12) {
            if let avatarUrl = statsViewModel.userAvatar, let url = URL(string: avatarUrl) {
                AsyncImage(url: url) { image in
                    image.resizable()
                         .aspectRatio(contentMode: .fit)
                         .frame(width: 32, height: 32)
                         .clipShape(Circle())
                } placeholder: {
                    Circle().fill(Color.secondary.opacity(0.2)).frame(width: 32, height: 32)
                }
            }
            
            VStack(alignment: .leading, spacing: 0) {
                Text(statsViewModel.username)
                    .font(.headline)
                Text(statsViewModel.isLoading ? "Syncing..." : "Connected")
                    .font(.caption)
                    .foregroundColor(statsViewModel.isLoading ? .orange : .green)
            }
            
            Spacer()
            
            Button("Logout", role: .destructive) {
                statsViewModel.logout()
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
        }
    }
    
    private var loginButton: some View {
        Button(action: { statsViewModel.loginWithGitHub() }) {
            HStack {
                Image(systemName: "person.badge.key.fill")
                Text("Authenticate with GitHub")
            }
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .controlSize(.large)
    }
    
    private var chartView: some View {
        Chart {
            ForEach(statsViewModel.dailyStats) { stat in
                let val = metricValue(for: stat)
                
                AreaMark(
                    x: .value("Date", stat.date),
                    y: .value("Value", val)
                )
                .foregroundStyle(
                    .linearGradient(
                        colors: [metricColor.opacity(0.3), metricColor.opacity(0.05)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .interpolationMethod(.monotone)
                
                LineMark(
                    x: .value("Date", stat.date),
                    y: .value("Value", val)
                )
                .foregroundStyle(metricColor)
                .interpolationMethod(.monotone)
                .lineStyle(StrokeStyle(lineWidth: 2))
                
                if let hoveredDate = hoveredDate, Calendar.current.isDate(stat.date, inSameDayAs: hoveredDate) {
                    RuleMark(x: .value("Date", hoveredDate))
                        .foregroundStyle(Color.primary.opacity(0.1))
                        .lineStyle(StrokeStyle(lineWidth: 1, dash: [4, 2]))
                    
                    PointMark(
                        x: .value("Date", stat.date),
                        y: .value("Value", val)
                    )
                    .foregroundStyle(metricColor)
                    .symbolSize(100)
                }
            }
        }
        .chartXAxis {
            AxisMarks(values: .stride(by: .day, count: statsViewModel.selectedRange == .month1m ? 7 : 1)) { _ in
                AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5)).foregroundStyle(Color.primary.opacity(0.05))
                AxisValueLabel(format: .dateTime.day().month(), centered: true)
                    .font(.system(size: 8, design: .monospaced))
            }
        }
        .chartYAxis {
            AxisMarks { value in
                AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5)).foregroundStyle(Color.primary.opacity(0.05))
                AxisValueLabel()
                    .font(.system(size: 8, design: .monospaced))
            }
        }
        .chartOverlay { proxy in
            GeometryReader { geometry in
                Rectangle().fill(.clear).contentShape(Rectangle())
                    .onContinuousHover { phase in
                        switch phase {
                        case .active(let location):
                            let date: Date? = proxy.value(atX: location.x)
                            hoveredDate = date
                        case .ended:
                            hoveredDate = nil
                        }
                    }
            }
        }
    }
    
    private func chartValueLabel(label: String, value: String) -> some View {
        VStack(alignment: .trailing, spacing: 0) {
            Text(label)
                .font(.system(size: 7, weight: .bold, design: .monospaced))
                .foregroundColor(.secondary)
            Text(value)
                .font(.system(size: 11, weight: .bold, design: .monospaced))
                .foregroundColor(.primary)
        }
    }
    
    private var metricColor: Color {
        switch statsViewModel.selectedMetric {
        case .commits: return .blue
        case .additions: return .green
        case .deletions: return .red
        }
    }
    
    private func metricValue(for stat: LocalStore.DailyStat) -> Int {
        switch statsViewModel.selectedMetric {
        case .commits: return stat.commits
        case .additions: return stat.additions
        case .deletions: return stat.deletions
        }
    }
    
    private func formatDateShort(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM dd"
        return formatter.string(from: date)
    }
}
