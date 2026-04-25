//
//  PasteInputModule.h
//  react-native-paste-input
//
//  TurboModule that registers TextInput instances for paste interception
//  using dynamic subclassing (per-instance method swizzling)
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React-RCTAppDelegate/RCTRootViewFactory.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <PasteTextInputSpecs/PasteTextInputSpecs.h>
#endif

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
@interface PasteInputModule : RCTEventEmitter <NativePasteInputModuleSpec>
#else
@interface PasteInputModule : RCTEventEmitter <RCTBridgeModule>
#endif

+ (void)setup:(nonnull RCTRootViewFactory *)rootViewFactory;

@end

NS_ASSUME_NONNULL_END
