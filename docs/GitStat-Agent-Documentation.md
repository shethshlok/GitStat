# GitStat Agent Documentation

## Overview

GitStat is a macOS menu bar utility for tracking GitHub contribution metrics, including commits, repositories, branches, and line changes across time ranges such as 24H, 1W, and 1M.

## Architecture

The app follows an MVVM structure with Swift concurrency:

```text
Views
  PopoverView
  SettingsView
  StatsShareView

ViewModels
  StatsViewModel

Services
  GitHubAPIService
  LocalStore
  KeychainManager
```

## File Structure

```text
GitStat/
  Sources/
    App/
      GitStatApp.swift
      AppDelegate.swift
    Services/
      GitHubAPI.swift
      GitHubAuthService.swift
      StatsViewModel.swift
    Views/
      PopoverView.swift
      SettingsView.swift
      StatsShareView.swift
    KeychainManager.swift
    LocalStore.swift
    Logger.swift
  Resources/
    Info.plist
    Assets.xcassets/
    GitStat.entitlements
  project.yml
```

## Key Features

### Chronological Sync Strategy

- Phase 1 fetches the first page of events for an instant UI update.
- Phase 2 backfills up to 300 historical events to populate the local ledger.
- Deduplication uses GitHub event IDs so metrics are not double-counted in `LocalStore`.

### Thread Safety

- `GitHubAPIService` is implemented as a Swift `actor` to prevent data races during parallel compare API calls.
- `StatsViewModel` manages `currentFetchTask` to cancel redundant or stale network requests.

### Persistent Ledger

- Stores pushes in `commit_history.json` in Application Support.
- Allows offline switching between 1W and 1M time ranges without extra API calls.
- Provides daily aggregated data for Swift Charts in Settings.

### Secure Authentication

- Uses `ASWebAuthenticationSession` for GitHub OAuth.
- Stores the access token and username in Keychain.

### Sharing and Export

- Uses `ImageRenderer` to generate high-resolution PNG reports from `StatsShareView`.
- Loads resources such as avatars asynchronously to avoid blocking the UI.

## Development Standards

- Deployment target: macOS 13.0+.
- Style: restrained native macOS UI with monospaced typography and vibrancy.
- API behavior: prefer local caching and a 24-hour sliding-window sync where possible.
