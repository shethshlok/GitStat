# GitStat - macOS Menu Bar App Specification

## 1. Project Overview

- **Project Name**: GitStat
- **Bundle Identifier**: com.gitstat.app
- **Core Functionality**: A lightweight macOS menu bar application that displays a user's GitHub commit statistics (total commits and code lines pushed) from the last 24 hours.
- **Target Users**: Developers who want to track their daily GitHub activity
- **macOS Version Support**: macOS 12.0 (Monterey) and later

## 2. UI/UX Specification

### Window Structure
- **Menu Bar Status Item**: Primary interface - shows an icon in the macOS menu bar
- **Popover View**: Shows stats when clicking the status item
- **Settings Window**: Modal window for entering GitHub username

### Visual Design

#### Color Palette
- **Primary Background**: #1E1E1E (dark gray)
- **Secondary Background**: #2D2D2D (lighter gray)
- **Accent Color**: #238636 (GitHub green)
- **Text Primary**: #FFFFFF (white)
- **Text Secondary**: #8B949E (gray)
- **Error Color**: #F85149 (red)

#### Typography
- **Title**: SF Pro Display, 18pt, Bold
- **Heading**: SF Pro Display, 14pt, Semibold
- **Body**: SF Pro Text, 13pt, Regular
- **Caption**: SF Pro Text, 11pt, Regular

#### Spacing System (8pt grid)
- **Popover Padding**: 16pt
- **Item Spacing**: 12pt
- **Section Spacing**: 16pt

### Views & Components

#### Menu Bar Status Item
- Custom icon: GitHub-inspired commit icon (circle with lines)
- States: Normal, Loading (animated), Error (red dot)

#### Popover View (280pt x 200pt)
- **Header**: "GitStat" title with refresh button
- **Stats Section**:
  - Commits count (large number + label)
  - Lines added (green + number)
  - Lines deleted (red + number)
- **Footer**: Last updated timestamp + Settings button
- **Empty State**: Message asking user to configure username

#### Settings Window (400pt x 180pt)
- GitHub username text field
- Save button
- Cancel button
- Info text explaining what data is fetched

## 3. Functionality Specification

### Core Features

1. **GitHub Username Configuration** (Priority: High)
   - User enters GitHub username in settings
   - Username is stored in UserDefaults
   - Validation: Check username exists via GitHub API

2. **Fetch Commit Statistics** (Priority: High)
   - Use GitHub Events API to get PushEvents from last 24 hours
   - Calculate total commits from all push events
   - Calculate total lines added/deleted from commit details

3. **Auto-refresh** (Priority: Medium)
   - Refresh stats every 5 minutes when popover is open
   - Manual refresh button available

4. **Error Handling** (Priority: Medium)
   - Handle network errors gracefully
   - Show user-friendly error messages
   - Retry mechanism for failed requests

### User Interactions
- Click status item → Open popover with stats
- Click refresh → Fetch latest stats
- Click settings → Open settings window
- Enter username → Save and fetch stats

### Data Handling
- **Storage**: UserDefaults for username and cached stats
- **API**: GitHub REST API (no authentication required for public data)
- **Refresh**: 5-minute interval when popover is visible

### Architecture Pattern
- **MVVM** (Model-View-ViewModel)
  - Models: GitHubUser, GitHubEvent, CommitStats
  - Views: PopoverView, SettingsView
  - ViewModels: StatsViewModel, SettingsViewModel
  - Services: GitHubAPIService

## 4. Technical Specification

### Dependencies
- No external dependencies required (using native URLSession)

### UI Framework
- **SwiftUI** for views (macOS 12+)
- **AppKit** for menu bar integration (NSStatusItem)

### Required Assets
- App Icon (1024x1024 for all sizes)
- Menu Bar Icon (18x18 @1x, 36x36 @2x)
- SF Symbols: arrow.clockwise, gear, chevron.right

### GitHub API Endpoints
- User events: `GET /users/{username}/events/public`
- Rate limit: 60 requests/hour for unauthenticated

### Entitlements
- App Sandbox: Yes
- Network Client: Yes (outgoing connections)
