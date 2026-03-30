# GitStat Agent Documentation

## Overview
GitStat is a high-performance macOS menu bar utility designed for developers to track their GitHub contribution metrics (commits, repositories, branches, and line changes) over various time ranges (24H, 1W, 1M).

## Architecture
The app follows a modern **MVVM (Model-View-ViewModel)** pattern with Swift Concurrency (Actors/Tasks):

```
┌─────────────────────────────────────────────────────────────┐
│                         Views                                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ PopoverView │  │ SettingsView │  │   StatsShareView  │  │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬─────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      ViewModels                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  StatsViewModel                      │    │
│  │  - @Published stats, recentEvents, dailyStats       │    │
│  │  - @MainActor state management & task cancellation  │    │
│  └─────────────────────────┬───────────────────────────┘    │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       Services                              │
│  ┌────────────────────┐  ┌───────────────────┐  ┌────────┐  │
│  │  GitHubAPIService  │  │    LocalStore     │  │Keychain│  │
│  │  (Actor-isolated)  │  │ (SQLite/JSON Ledg)│  │Manager │  │
│  └────────────────────┘  └───────────────────┘  └────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
GitStat/
├── Sources/
│   ├── App/
│   │   ├── GitStatApp.swift         # SwiftUI App entry point
│   │   └── AppDelegate.swift       # NSApplicationDelegate & Menu Bar Controller
│   ├── Services/
│   │   ├── GitHubAPI.swift         # Actor-isolated GitHub API client
│   │   ├── GitHubAuthService.swift # OAuth Web Flow handler
│   │   └── StatsViewModel.swift    # Core business logic & UI State
│   ├── Views/
│   │   ├── PopoverView.swift       # Main Menu Bar interface
│   │   ├── SettingsView.swift      # Configuration & Detailed Analytics
│   │   └── StatsShareView.swift    # High-fidelity sharing template
│   ├── KeychainManager.swift       # Centralized secure storage (Token/User)
│   ├── LocalStore.swift            # Persistent historical data ledger
│   └── Logger.swift                # OSLog-based system logger
├── Resources/
│   ├── Info.plist                  # App configuration & URL Schemes
│   ├── Assets.xcassets/           # Branded MenuBarIcon & App Icons
│   └── GitStat.entitlements       # Sandbox & Network permissions
└── project.yml                     # XcodeGen project configuration
```

## Key Features & Logic

### 1. Chronological Sync Strategy
- **Phase 1 (Sync):** Fetches the first page of events for instant UI update.
- **Phase 2 (Backfill):** Pulls up to 300 historical events to populate the local ledger.
- **Deduplication:** Uses unique GitHub event IDs to ensure metrics are never double-counted in `LocalStore`.

### 2. Thread Safety (Swift 6 Ready)
- **GitHubAPIService:** Implemented as a Swift `actor` to prevent data races during parallel "Compare API" calls.
- **Task Management:** `StatsViewModel` manages a `currentFetchTask` to cancel redundant or stale network requests automatically.

### 3. Persistent Ledger (`LocalStore`)
- Stores pushes in `commit_history.json` within Application Support.
- Allows for instant, offline switching between **1W** and **1M** time ranges without additional API calls.
- Provides daily aggregated data for the interactive **Swift Charts** in Settings.

### 4. Secure Authentication
- **OAuth Web Flow:** Uses `ASWebAuthenticationSession` for secure GitHub login.
- **Centralized Keychain:** Stores both the Access Token and Username in the system Keychain for high security.

### 5. Sharing & Export
- Uses `ImageRenderer` to generate high-resolution PNG reports from `StatsShareView`.
- Asynchronous resource loading (avatars) ensures zero UI blocking during export.

## Development Standards
- **Deployment Target:** macOS 13.0+ (Required for Swift Charts and ImageRenderer).
- **Styling:** Refined Utilitarian aesthetic with monospaced typography and native macOS vibrancy.
- **API Optimization:** Minimizes calls via local caching and 24-hour sliding window logic.
