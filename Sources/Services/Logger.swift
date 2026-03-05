import Foundation
import OSLog

class Logger {
    static let shared = Logger()
    private let logger = os.Logger(subsystem: "com.gitstat", category: "App")
    
    enum Level {
        case info, error, debug
    }
    
    func log(_ message: String, level: Level = .info) {
        #if DEBUG
        print("[\(level)] GitStat: \(message)")
        #endif
        
        switch level {
        case .info:
            logger.info("\(message)")
        case .error:
            logger.error("\(message)")
        case .debug:
            logger.debug("\(message)")
        }
    }
}
