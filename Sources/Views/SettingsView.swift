import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var statsViewModel: StatsViewModel
    @State private var showingAlert: Bool = false
    @State private var alertMessage: String = ""
    
    var body: some View {
        ZStack {
            VisualEffectView(material: .sidebar, blendingMode: .behindWindow)
                .ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 24) {
                // Header
                VStack(alignment: .leading, spacing: 4) {
                    Text("GITSTAT_CONFIG")
                        .font(.system(size: 10, weight: .bold, design: .monospaced))
                        .foregroundColor(.secondary)
                    
                    Text("Connection Settings")
                        .font(.system(size: 20, weight: .bold))
                }
                
                // Account Section
                VStack(alignment: .leading, spacing: 12) {
                    Text("AUTHENTICATED_USER")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(.secondary)
                    
                    if statsViewModel.isAuthenticated {
                        HStack(spacing: 16) {
                            if let avatarUrl = statsViewModel.userAvatar, let url = URL(string: avatarUrl) {
                                AsyncImage(url: url) { image in
                                    image.resizable()
                                         .aspectRatio(contentMode: .fit)
                                         .frame(width: 48, height: 48)
                                         .clipShape(RoundedRectangle(cornerRadius: 12))
                                         .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.primary.opacity(0.1), lineWidth: 1))
                                } placeholder: {
                                    RoundedRectangle(cornerRadius: 12).fill(Color.secondary.opacity(0.2)).frame(width: 48, height: 48)
                                }
                            }
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text(statsViewModel.username)
                                    .font(.system(size: 16, weight: .bold, design: .monospaced))
                                
                                HStack(spacing: 4) {
                                    Circle().fill(Color.green).frame(width: 6, height: 6)
                                    Text("Status: Online")
                                        .font(.system(size: 11))
                                        .foregroundColor(.secondary)
                                }
                            }
                            
                            Spacer()
                            
                            Button(action: { statsViewModel.logout() }) {
                                Text("TERMINATE_SESSION")
                                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                                    .foregroundColor(.red)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color.red.opacity(0.1))
                                    .cornerRadius(4)
                            }
                            .buttonStyle(.plain)
                        }
                        .padding(16)
                        .background(Color.primary.opacity(0.03))
                        .cornerRadius(12)
                    } else {
                        Button(action: { statsViewModel.loginWithGitHub() }) {
                            HStack {
                                Image(systemName: "person.badge.key.fill")
                                Text("AUTHENTICATE_WITH_GITHUB")
                            }
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.primary)
                            .foregroundColor(.white)
                            .cornerRadius(8)
                        }
                        .buttonStyle(.plain)
                    }
                }
                
                // Info
                Text("GitStat monitors standard activity events (Push, PullRequest, Issues) over a rolling 24-hour window. Data is updated every 5 minutes.")
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                    .lineSpacing(4)
                
                Spacer()
                
                // Footer Actions
                HStack {
                    Spacer()
                    
                    Button("Done") {
                        NSApp.sendAction(#selector(NSWindow.performClose(_:)), to: nil, from: nil)
                    }
                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                }
            }
            .padding(32)
        }
        .frame(width: 480, height: 320)
        .alert("Error", isPresented: $showingAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(alertMessage)
        }
        .onChange(of: statsViewModel.errorMessage) { newValue in
            if let error = newValue {
                alertMessage = error
                showingAlert = true
            }
        }
    }
}
