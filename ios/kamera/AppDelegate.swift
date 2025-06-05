import UIKit
import React

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  var window: UIWindow?
  var bridge: RCTBridge?
  var rootView: RCTRootView?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let jsBundleURL: URL = {
      #if DEBUG
      return RCTBundleURLProvider.sharedSettings()
        .jsBundleURL(forBundleRoot: "index", fallbackExtension: nil)!
      #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
      #endif
    }()

    bridge = RCTBridge(bundleURL: jsBundleURL, moduleProvider: nil, launchOptions: launchOptions)

    rootView = RCTRootView(bridge: bridge!, moduleName: "kamera", initialProperties: nil)
    rootView?.backgroundColor = .white

    window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()

    return true
  }
}