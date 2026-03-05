# GitStat - Architecture & Feature Documentation

## Overview

GitStat is a lightweight macOS menu bar application that displays a user's GitHub commit statistics (total commits and code lines pushed) from the last 24 hours. The app runs as a status bar item without a dock icon.

## Architecture

The app follows the **MVVM (Model-View-ViewModel)** pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                         Views                                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ PopoverView │  │ SettingsView │  │   GitStatApp      │  │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬─────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      ViewModels                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  StatsViewModel                      │    │
│  │  - @Published stats, isLoading, errorMessage       │    │
│  │  - fetchStats(), saveUsername()                     │    │
│  └─────────────────────────┬───────────────────────────┘    │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       Services                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  GitHubAPIService                    │    │
│  │  - fetchEvents(for:)                                │    │
│  │  - calculateStats(from:)                           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
GitStat/
├── Sources/
│   ├── App/
│   │   ├── GitStatApp.swift         # SwiftUI App entry point
│   │   └── AppDelegate.swift       # NSApplicationDelegate + Menu Bar
│   ├── Services/
│   │   ├── GitHubAPI.swift         # GitHub API models & service
│   │   └── StatsViewModel.swift    # Business logic & state
│   └── Views/
│       ├── PopoverView.swift       # Stats display UI
│       └── SettingsView.swift      # Username input UI
├── Resources/
│   ├── Info.plist                  # App configuration (LSUIElement)
│   ├── GitStat.entitlements       # Sandbox + Network permissions
│   └── Assets.xcassets/           # App icons
└── project.yml                     # XcodeGen configuration
```

## Component Details

### 1. GitStatApp.swift

**Purpose**: Main SwiftUI app entry point

**Responsibilities**:
- Creates the SwiftUI app
- Attaches the AppDelegate via `@NSApplicationDelegateAdaptor`
- Provides the Settings scene

```swift
@main
struct GitStatApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        Settings {
            SettingsView()
                .environmentObject(appDelegate.statsViewModel)
        }
    }
}
```

### 2. AppDelegate.swift

**Purpose**: Handles macOS-specific functionality (menu bar, popover)

**Responsibilities**:
- Creates and manages the NSStatusItem (menu bar icon)
- Manages the NSPopover for displaying stats
- Sets up event monitoring to close popover on click outside
- Initializes the StatsViewModel

**Key Methods**:
- `setupStatusItem()`: Creates the menu bar button with SF Symbol icon
- `setupPopover()`: Creates the SwiftUI popover with PopoverView
- `setupEventMonitor()`: Closes popover when clicking outside
- `togglePopover()`: Shows/hides the popover

### 3. GitHubAPI.swift

**Purpose**: GitHub API integration and data models

**Data Models**:
- `GitHubEvent`: Represents a GitHub event (PushEvent, etc.)
- `GitHubActor`: User who performed the action
- `GitHubPayload`: Event-specific data (commits array)
- `GitHubCommit`: Individual commit details
- `CommitStats`: Aggregated statistics (commits, lines added/deleted)

**API Methods**:
- `fetchEvents(for username:)`: Calls `GET /users/{username}/events/public`
- `calculateStats(from events:)`: Filters PushEvents from last 24 hours and calculates totals

**API Endpoint**:
```
GET https://api.github.com/users/{username}/events/public
```

**Rate Limit**: 60 requests/hour for unauthenticated requests

### 4. StatsViewModel.swift

**Purpose**: Central state management and business logic

**Published Properties**:
- `stats`: Current commit statistics
- `isLoading`: Loading state for async operations
- `errorMessage`: Error message to display
- `username`: Saved GitHub username

**Methods**:
- `fetchStats()`: Fetches events from GitHub and calculates stats
- `saveUsername(_:)`: Saves username to UserDefaults and triggers fetch
- `startAutoRefresh()`: Starts 5-minute refresh timer
- `stopAutoRefresh()`: Stops the refresh timer

**Storage**: Uses `UserDefaults` with key `githubUsername`

### 5. PopoverView.swift

**Purpose**: Main UI displayed in the menu bar popover

**Layout**:
- Header: App title + refresh button
- Content: Stats display or empty/loading/error states
- Footer: Last updated timestamp + settings button

**States**:
- No username: Prompts user to configure
- Loading: Shows spinner
- Error: Shows error message with retry button
- Success: Displays commit count, lines added, lines deleted

### 6. SettingsView.swift

**Purpose**: Settings window for username configuration

**Features**:
- Text field for GitHub username
- Save/Cancel buttons
- Username validation (regex pattern)
- Error alerts for invalid input

## Feature Flow

### First Launch Flow
```
1. App starts → Menu bar icon appears
2. User clicks icon → Popover shows "No Username Set"
3. User clicks "Open Settings" or presses Cmd+,
4. Settings window opens
5. User enters GitHub username
6. User clicks Save
7. StatsViewModel.saveUsername() stores in UserDefaults
8. StatsViewModel.fetchStats() is called
9. Popover updates with GitHub stats
```

### Data Refresh Flow
```
1. Popover opens → startAutoRefresh() called
2. fetchStats() called immediately if username exists
3. GitHubAPIService fetches public events
4. Events filtered for PushEvent type in last 24 hours
5. Stats calculated (commits count, estimated lines)
6. UI updates via @Published properties
7. Timer fires every 5 minutes → fetchStats() called again
8. Popover closes → stopAutoRefresh() called
```

### Stats Calculation Logic
```swift
// Pseudocode for calculateStats()
for each event in events:
    if event.date >= 24 hours ago AND event.type == "PushEvent":
        stats.totalCommits += event.payload.commits.count
        
        for each commit in commits:
            // Estimate lines (GitHub API doesn't provide line counts in events)
            stats.linesAdded += added_files * 50 + modified_files * 20
            stats.linesDeleted += removed_files * 50 + modified_files * 10
```

**Note**: The GitHub public events API doesn't provide exact line counts. The app uses estimated values (50 lines per added file, 20 lines per modified file, etc.) as a reasonable approximation.

## App Configuration

### Info.plist
- `LSUIElement = true`: App runs as menu bar only (no dock icon)
- `NSAppTransportSecurity`: Allows HTTPS connections to api.github.com

### Entitlements
- `com.apple.security.app-sandbox`: Enabled for App Store
- `com.apple.security.network.client`: Allows outgoing network requests

## Dependencies

**None** - The app uses only native frameworks:
- SwiftUI (UI framework)
- AppKit (NSStatusItem, NSPopover)
- Foundation (URLSession, JSONDecoder, UserDefaults)
- Combine (@Published, @EnvironmentObject)

## Error Handling

| Error Type | User Message | Action |
|------------|--------------|--------|
| Network Error | "Network error: {details}" | Show retry button |
| User Not Found | "GitHub user not found" | Prompt username change |
| Rate Limited | "GitHub API rate limit exceeded" | Wait and retry |
| No Username | "Please set your GitHub username" | Open settings |

## Future Improvements

1. **Exact Line Counts**: Use GitHub GraphQL API for precise commit diffs
2. **Multiple Time Ranges**: Add 7 days, 30 days options
3. **Multiple Accounts**: Support multiple GitHub usernames
4. **Notifications**: Alert when daily goals are met
5. **Personal Access Token**: Optional auth for higher rate limits
