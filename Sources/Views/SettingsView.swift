import SwiftUI
import Charts

struct SettingsView: View {
    @EnvironmentObject var statsViewModel: StatsViewModel
    @State private var showingAlert: Bool = false
    @State private var showingClearConfirmation: Bool = false
    @State private var alertMessage: String = ""
    @State private var hoveredDate: Date?
    
    var body: some View {
        ZStack {
            VisualEffectView(material: .sidebar, blendingMode: .behindWindow)
                .ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 20) {
                headerSection
                chartSection
                accountSection
                footerSection
            }
            .padding(24)
        }
        .frame(width: 540, height: 460)
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
    
    // MARK: - Sections
    
    private var headerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("GITSTAT_ANALYTICS")
                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                    .foregroundColor(.secondary)
                
                Text("Usage Statistics")
                    .font(.system(size: 20, weight: .bold))
            }
            
            Spacer()
            
            Picker("", selection: $statsViewModel.selectedRange) {
                ForEach(TimeRange.chartableRanges) { range in
                    Text(range.label).tag(range)
                }
            }
            .pickerStyle(.segmented)
            .controlSize(.small)
            .frame(width: 80)
            .onAppear {
                if statsViewModel.selectedRange == .day24h {
                    statsViewModel.selectedRange = .week1w
                }
            }
        }
    }
    
    private var chartSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Picker("Metric", selection: $statsViewModel.selectedMetric) {
                    ForEach(ChartMetric.allCases) { metric in
                        Text(metric.rawValue).tag(metric)
                    }
                }
                .pickerStyle(.segmented)
                .controlSize(.small)
                .labelsHidden()
                .frame(width: 240)
                
                Spacer()
                
                if let hoveredDate = hoveredDate,
                   let stat = statsViewModel.dailyStats.first(where: { Calendar.current.isDate($0.date, inSameDayAs: hoveredDate) }) {
                    HStack(spacing: 12) {
                        chartValueLabel(label: "VALUE", value: "\(metricValue(for: stat))")
                        chartValueLabel(label: "DATE", value: formatDateShort(hoveredDate))
                    }
                }
            }
            
            chartView
                .frame(height: 140)
                .padding(.top, 8)
        }
        .padding(16)
        .background(Color.primary.opacity(0.03))
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.primary.opacity(0.05), lineWidth: 1))
    }
    
    private var accountSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("AUTHENTICATED_USER")
                .font(.system(size: 9, weight: .bold, design: .monospaced))
                .foregroundColor(.secondary)
            
            if statsViewModel.isAuthenticated {
                authenticatedUserRow
            } else {
                loginButton
            }
        }
    }
    
    private var authenticatedUserRow: some View {
        HStack(spacing: 16) {
            if let avatarUrl = statsViewModel.userAvatar, let url = URL(string: avatarUrl) {
                AsyncImage(url: url) { image in
                    image.resizable()
                         .aspectRatio(contentMode: .fit)
                         .frame(width: 40, height: 40)
                         .clipShape(RoundedRectangle(cornerRadius: 10))
                         .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.primary.opacity(0.1), lineWidth: 1))
                } placeholder: {
                    RoundedRectangle(cornerRadius: 10).fill(Color.secondary.opacity(0.2)).frame(width: 40, height: 40)
                }
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(statsViewModel.username)
                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                
                if statsViewModel.isLoading {
                    Text("Syncing...")
                        .font(.system(size: 8, weight: .bold, design: .monospaced))
                        .foregroundColor(.orange)
                } else {
                    HStack(spacing: 4) {
                        Circle().fill(Color.green).frame(width: 5, height: 5)
                        Text("Connected")
                            .font(.system(size: 10))
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            Spacer()
            
            Button(action: { statsViewModel.logout() }) {
                Text("LOGOUT")
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundColor(.red.opacity(0.8))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.red.opacity(0.05))
                    .cornerRadius(4)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(Color.primary.opacity(0.02))
        .cornerRadius(10)
    }
    
    private var loginButton: some View {
        Button(action: { statsViewModel.loginWithGitHub() }) {
            HStack {
                Image(systemName: "person.badge.key.fill")
                Text("AUTHENTICATE_WITH_GITHUB")
            }
            .font(.system(size: 11, weight: .bold, design: .monospaced))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(Color.primary)
            .foregroundColor(.white)
            .cornerRadius(6)
        }
        .buttonStyle(.plain)
    }
    
    private var footerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Total volume indexed: \(statsViewModel.stats.totalCommits) commits across \(statsViewModel.stats.reposCount) projects.")
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(.secondary)
                
                Button(action: { showingClearConfirmation = true }) {
                    Text("CLEAR_LOCAL_CACHE")
                        .font(.system(size: 8, weight: .bold, design: .monospaced))
                        .foregroundColor(.red.opacity(0.6))
                }
                .buttonStyle(.plain)
            }
            
            Spacer()
            
            Button("Close") {
                NSApp.sendAction(#selector(NSWindow.performClose(_:)), to: nil, from: nil)
            }
            .font(.system(size: 11, weight: .bold, design: .monospaced))
            .buttonStyle(.borderedProminent)
        }
    }
    
    // MARK: - Chart Components
    
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
