//
//  PasteInputModule.h
//  react-native-paste-input
//
//  TurboModule that registers TextInput instances for paste interception
//  using dynamic subclassing (per-instance method swizzling)
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#if __has_include(<React-RCTAppDelegate/RCTRootViewFactory.h>)
#import <React-RCTAppDelegate/RCTRootViewFactory.h>
#else
#import "React_RCTAppDelegate/RCTRootViewFactory.h"
#endif


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
