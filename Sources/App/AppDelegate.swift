import AppKit
import SwiftUI
import Combine

class AppDelegate: NSObject, NSApplicationDelegate, NSPopoverDelegate {
    private var statusItem: NSStatusItem!
    private var popover: NSPopover!
    private var eventMonitor: Any?
    private var cancellables = Set<AnyCancellable>()
    
    let statsViewModel = StatsViewModel()
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        setupStatusItem()
        setupPopover()
        setupEventMonitor()
        setupObservers()
        
        // Initial fetch if username exists
        if let username = UserDefaults.standard.string(forKey: "githubUsername"), !username.isEmpty {
            statsViewModel.fetchStats()
        }
    }
    
    private func setupStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        
        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "arrow.triangle.branch", accessibilityDescription: "GitStat")
            button.imagePosition = .imageLeading
            button.action = #selector(togglePopover)
            button.target = self
        }
    }
    
    private func setupObservers() {
        statsViewModel.$stats
            .receive(on: RunLoop.main)
            .sink { [weak self] stats in
                self?.updateStatusItem(stats)
            }
            .store(in: &cancellables)
        
        statsViewModel.$isLoading
            .receive(on: RunLoop.main)
            .sink { [weak self] isLoading in
                if isLoading {
                    self?.statusItem.button?.image = NSImage(systemSymbolName: "arrow.clockwise", accessibilityDescription: "Refreshing")
                } else {
                    self?.statusItem.button?.image = NSImage(systemSymbolName: "arrow.triangle.branch", accessibilityDescription: "GitStat")
                }
            }
            .store(in: &cancellables)
    }
    
    private func updateStatusItem(_ stats: CommitStats) {
        guard let button = statusItem.button else { return }
        
        if stats.totalCommits > 0 {
            let totalLines = stats.linesAdded + stats.linesDeleted
            let title = "\(stats.totalCommits)c | \(formatLines(totalLines))l"
            button.title = title
            button.font = .systemFont(ofSize: 11, weight: .medium)
        } else {
            button.title = ""
        }
    }
    
    private func formatLines(_ n: Int) -> String {
        if n >= 1000 {
            return String(format: "%.1fk", Double(n) / 1000.0)
        }
        return "\(n)"
    }
    
    private func setupPopover() {
        popover = NSPopover()
        popover.contentSize = NSSize(width: 280, height: 220)
        popover.behavior = .transient
        popover.delegate = self
        popover.contentViewController = NSHostingController(
            rootView: PopoverView()
                .environmentObject(statsViewModel)
        )
    }
    
    private func setupEventMonitor() {
        eventMonitor = NSEvent.addGlobalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] _ in
            if let popover = self?.popover, popover.isShown {
                popover.performClose(nil)
            }
        }
    }
    
    @objc private func togglePopover() {
        if popover.isShown {
            popover.performClose(nil)
        } else {
            if let button = statusItem.button {
                popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
                NSApp.activate(ignoringOtherApps: true)
            }
        }
    }
    
    func applicationWillTerminate(_ notification: Notification) {
        if let eventMonitor = eventMonitor {
            NSEvent.removeMonitor(eventMonitor)
        }
    }
}
