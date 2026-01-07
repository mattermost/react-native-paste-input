//
//  PasteInputModule.h
//  react-native-paste-input
//
//  TurboModule that registers TextInput instances for paste interception
//  using dynamic subclassing (per-instance method swizzling)
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <PasteTextInputSpecs/PasteTextInputSpecs.h>
#endif

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
@interface PasteInputModule : RCTEventEmitter <NativePasteInputModuleSpec>

// Static method to set the reactHost for bridgeless mode
// This must be called from AppDelegate after creating the reactHost
+ (void)setReactHost:(nullable id)reactHost;

#else
@interface PasteInputModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end

NS_ASSUME_NONNULL_END
