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
        // 1. Set activation policy first
        NSApp.setActivationPolicy(.accessory)
        
        // 2. Setup status item and popover now that app is initialized
        setupStatusItem()
        setupPopover()
        setupEventMonitor()
        setupObservers()
    }
    
    private func setupStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        
        if let button = statusItem.button {
            let icon: NSImage?
            if let customIcon = NSImage(named: "MenuBarIcon") {
                icon = customIcon
                Logger.shared.log("ICON: Successfully loaded custom MenuBarIcon")
            } else if let appIcon = NSImage(named: "AppIcon") {
                icon = appIcon
                Logger.shared.log("ICON: MenuBarIcon not found, falling back to AppIcon")
            } else {
                icon = NSImage(systemSymbolName: "cat.fill", accessibilityDescription: "GitStat")
                Logger.shared.log("ICON: No custom icons found, using system fallback")
            }
            
            // Ensure icon is sized for menu bar if it's too large
            icon?.size = NSSize(width: 18, height: 18)
            icon?.isTemplate = true // Crucial for visibility in light/dark mode
            
            button.image = icon
            button.imagePosition = .imageLeading
            button.action = #selector(togglePopover)
            button.target = self
        }
    }
    
    private func setupObservers() {
        statsViewModel.$stats
            .receive(on: RunLoop.main)
            .sink { [weak self] stats in
                self?.updateStatusItem()
            }
            .store(in: &cancellables)
        
        statsViewModel.$showActivityInMenuBar
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in
                self?.updateStatusItem()
            }
            .store(in: &cancellables)

        statsViewModel.$isLoading
            .receive(on: RunLoop.main)
            .sink { [weak self] isLoading in
                guard let self = self, let button = self.statusItem.button else { return }
                
                // Always keep the app icon visible
                button.image = self.getAppIcon()
                
                // If we want a subtle indicator, we can add it to the title or use a multi-image setup
                // For now, ensuring the icon NEVER disappears is the priority.
            }
            .store(in: &cancellables)
    }

    private func getAppIcon() -> NSImage? {
        guard let originalIcon = NSImage(named: "MenuBarIcon") ?? NSImage(named: "AppIcon") ?? NSImage(systemSymbolName: "cat.fill", accessibilityDescription: "GitStat") else { return nil }
        
        let targetSize = NSSize(width: 30, height: 30)
        let zoomedIcon = NSImage(size: targetSize)
        
        zoomedIcon.lockFocus()
        // Center 80% crop for a slightly more controlled zoom
        let cropFactor: CGFloat = 0.80
        let srcRect = NSRect(
            x: originalIcon.size.width * (1 - cropFactor) / 2,
            y: originalIcon.size.height * (1 - cropFactor) / 2,
            width: originalIcon.size.width * cropFactor,
            height: originalIcon.size.height * cropFactor
        )
        
        originalIcon.draw(in: NSRect(origin: .zero, size: targetSize), from: srcRect, operation: .sourceOver, fraction: 1.0)
        zoomedIcon.unlockFocus()
        
        zoomedIcon.isTemplate = true
        return zoomedIcon
    }

    private func updateStatusItem() {
        guard let button = statusItem.button else { return }
        let stats = statsViewModel.stats
        
        if statsViewModel.showActivityInMenuBar && stats.totalCommits > 0 {
            let totalLines = stats.linesAdded + stats.linesDeleted
            button.title = " \(stats.totalCommits)c | \(formatLines(totalLines))l"
            button.font = .monospacedDigitSystemFont(ofSize: 10, weight: .bold)
        } else {
            button.title = ""
        }
        
        let icon = getAppIcon()
        icon?.isTemplate = true
        button.image = icon
    }

    
    private func formatLines(_ n: Int) -> String {
        if n >= 1000000 {
            return String(format: "%.1fM", Double(n) / 1000000.0)
        } else if n >= 1000 {
            return String(format: "%.1fK", Double(n) / 1000.0)
        }
        return "\(n)"
    }
    
    private func setupPopover() {
        popover = NSPopover()
        popover.contentSize = NSSize(width: 320, height: 480)
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
