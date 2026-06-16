import Foundation
import AuthenticationServices

class GitHubAuthService: NSObject, ASWebAuthenticationPresentationContextProviding {
    static let shared = GitHubAuthService()
    
    // Replace these with actual values from GitHub Developer Settings
    private let clientID = "Ov23liA0CM4cRHNQkjTy"
    private let clientSecret = "c92fc82b05295e6060adabcf36d7d3236c965023"
    private let callbackURLScheme = "gitstat"
    private let callbackURL = "gitstat://oauth-callback"
    
    func login() async throws -> String {
        let authURL = URL(string: "https://github.com/login/oauth/authorize?client_id=\(clientID)&scope=repo,user")!
        
        return try await withCheckedThrowingContinuation { continuation in
            let session = ASWebAuthenticationSession(
                url: authURL,
                callbackURLScheme: callbackURLScheme
            ) { callbackURL, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }
                
                guard let callbackURL = callbackURL,
                      let queryItems = URLComponents(url: callbackURL, resolvingAgainstBaseURL: false)?.queryItems,
                      let code = queryItems.first(where: { $0.name == "code" })?.value else {
                    continuation.resume(throwing: NSError(domain: "GitHubAuthService", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid callback URL"]))
                    return
                }
                
                Task {
                    do {
                        let token = try await self.exchangeCodeForToken(code: code)
                        continuation.resume(returning: token)
                    } catch {
                        continuation.resume(throwing: error)
                    }
                }
            }
            
            session.presentationContextProvider = self
            session.start()
        }
    }
    
    private func exchangeCodeForToken(code: String) async throws -> String {
        let url = URL(string: "https://github.com/login/oauth/access_token")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: String] = [
            "client_id": clientID,
            "client_secret": clientSecret,
            "code": code
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw NSError(domain: "GitHubAuthService", code: 2, userInfo: [NSLocalizedDescriptionKey: "Failed to exchange code for token"])
        }
        
        if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
           let accessToken = json["access_token"] as? String {
            return accessToken
        } else {
            throw NSError(domain: "GitHubAuthService", code: 3, userInfo: [NSLocalizedDescriptionKey: "Invalid token response"])
        }
    }
    
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        return NSApplication.shared.windows.first ?? NSWindow()
    }
}
