import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UIKit
import react_native_paste_input

class SceneDelegate: RCTDefaultReactNativeFactoryDelegate, UIWindowSceneDelegate {
    var window: UIWindow?
    var reactNativeFactory: RCTReactNativeFactory?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else {
            return
        }

        dependencyProvider = RCTAppDependencyProvider()
        let factory = RCTReactNativeFactory(delegate: self)
        reactNativeFactory = factory
        window = UIWindow(windowScene: windowScene)

        factory.startReactNative(
            withModuleName: "ReactNativePasteInputExample",
            in: window,
            connectionOptions: connectionOptions
        )

        PasteInputModule.setup(factory.rootViewFactory)
    }

    override func bundleURL() -> URL? {
#if DEBUG
        RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
        Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
    }
}
