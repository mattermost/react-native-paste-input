//
//  PasteTextInputComponentView.h
//  react-native-paste-input
//
//  Stub ComponentView for iOS - actual paste handling done by PasteInputModule
//  This exists only to satisfy codegen requirements when using type: "all"
//

#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTTextInputComponentView.h>
#import <React/RCTComponentViewProtocol.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * On iOS, we use the TurboModule approach with dynamic subclassing for paste interception.
 * This ComponentView is just a passthrough to the standard RCTTextInputComponentView.
 * Android uses a real custom ComponentView since it cannot do runtime method swizzling.
 */
@interface PasteTextInputComponentView : RCTTextInputComponentView

@end

NS_ASSUME_NONNULL_END

#endif /* RCT_NEW_ARCH_ENABLED */
