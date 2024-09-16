#import <React/RCTLog.h>
#import <React/RCTUIManager.h>
#import <React/RCTViewManager.h>

#import <React/RCTBaseTextInputShadowView.h>
#import <React/RCTBaseTextInputView.h>
#import <React/RCTConvert+Text.h>

#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTShadowView+Layout.h>
#import <React/RCTShadowView.h>

#import "PasteTextInput.h"
#import "PasteInputView.h"

#ifdef RCT_NEW_ARCH_ENABLED
@interface PasteTextInputManager : RCTViewManager
@end
#else
#import <React/RCTMultilineTextInputViewManager.h>

@interface PasteTextInputManager : RCTMultilineTextInputViewManager

@end
#endif

@implementation PasteTextInputManager {
    NSHashTable<RCTBaseTextInputShadowView *> *_shadowViews;
}

RCT_EXPORT_MODULE(PasteTextInput)

RCT_EXPORT_VIEW_PROPERTY(disableCopyPaste, BOOL)
RCT_EXPORT_VIEW_PROPERTY(smartPunctuation, NSString)

RCT_EXPORT_VIEW_PROPERTY(onPaste, RCTBubblingEventBlock)

#pragma mark - Unified <PasteTextInput> properties
#ifdef RCT_NEW_ARCH_ENABLED
RCT_REMAP_VIEW_PROPERTY(autoCapitalize, backedTextInputView.autocapitalizationType, UITextAutocapitalizationType)
RCT_REMAP_VIEW_PROPERTY(autoCorrect, backedTextInputView.autocorrectionType, UITextAutocorrectionType)
RCT_REMAP_VIEW_PROPERTY(contextMenuHidden, backedTextInputView.contextMenuHidden, BOOL)
RCT_REMAP_VIEW_PROPERTY(editable, backedTextInputView.editable, BOOL)
RCT_REMAP_VIEW_PROPERTY(enablesReturnKeyAutomatically, backedTextInputView.enablesReturnKeyAutomatically, BOOL)
RCT_REMAP_VIEW_PROPERTY(keyboardAppearance, backedTextInputView.keyboardAppearance, UIKeyboardAppearance)
RCT_REMAP_VIEW_PROPERTY(placeholder, backedTextInputView.placeholder, NSString)
RCT_REMAP_VIEW_PROPERTY(placeholderTextColor, backedTextInputView.placeholderColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(returnKeyType, backedTextInputView.returnKeyType, UIReturnKeyType)
RCT_REMAP_VIEW_PROPERTY(selectionColor, backedTextInputView.tintColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(spellCheck, backedTextInputView.spellCheckingType, UITextSpellCheckingType)
RCT_REMAP_VIEW_PROPERTY(caretHidden, backedTextInputView.caretHidden, BOOL)
RCT_REMAP_VIEW_PROPERTY(clearButtonMode, backedTextInputView.clearButtonMode, UITextFieldViewMode)
RCT_REMAP_VIEW_PROPERTY(scrollEnabled, backedTextInputView.scrollEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(secureTextEntry, backedTextInputView.secureTextEntry, BOOL)
RCT_REMAP_VIEW_PROPERTY(smartInsertDelete, backedTextInputView.smartInsertDeleteType, UITextSmartInsertDeleteType)
RCT_EXPORT_VIEW_PROPERTY(autoFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(submitBehavior, NSString)
RCT_EXPORT_VIEW_PROPERTY(clearTextOnFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(keyboardType, UIKeyboardType)
RCT_EXPORT_VIEW_PROPERTY(showSoftInputOnFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(maxLength, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(selectTextOnFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(selection, RCTTextSelection)
RCT_EXPORT_VIEW_PROPERTY(inputAccessoryViewID, NSString)
RCT_EXPORT_VIEW_PROPERTY(textContentType, NSString)
RCT_EXPORT_VIEW_PROPERTY(passwordRules, NSString)

RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSelectionChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScroll, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)

RCT_EXPORT_SHADOW_PROPERTY(text, NSString)
RCT_EXPORT_SHADOW_PROPERTY(placeholder, NSString)
RCT_EXPORT_SHADOW_PROPERTY(onContentSizeChange, RCTDirectEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(multiline, BOOL, UIView)
{
  // No op.
  // This View Manager doesn't use this prop but it must be exposed here via ViewConfig to enable Fabric component use
  // it.
}

- (RCTShadowView *)shadowView
{
  RCTBaseTextInputShadowView *shadowView = [[RCTBaseTextInputShadowView alloc] initWithBridge:self.bridge];
  shadowView.textAttributes.fontSizeMultiplier =
      [[[self.bridge moduleForName:@"AccessibilityManager"
             lazilyLoadIfNecessary:YES] valueForKey:@"multiplier"] floatValue];
  [_shadowViews addObject:shadowView];
  return shadowView;
}

RCT_EXPORT_METHOD(focus : (nonnull NSNumber *)viewTag)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    UIView *view = viewRegistry[viewTag];
    [view reactFocus];
  }];
}

RCT_EXPORT_METHOD(blur : (nonnull NSNumber *)viewTag)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    UIView *view = viewRegistry[viewTag];
    [view reactBlur];
  }];
}

RCT_EXPORT_METHOD(setTextAndSelection
                  : (nonnull NSNumber *)viewTag mostRecentEventCount
                  : (NSInteger)mostRecentEventCount value
                  : (NSString *)value start
                  : (NSInteger)start end
                  : (NSInteger)end)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RCTBaseTextInputView *view = (RCTBaseTextInputView *)viewRegistry[viewTag];
    NSInteger eventLag = view.nativeEventCount - mostRecentEventCount;
    if (eventLag != 0) {
      return;
    }
    RCTExecuteOnUIManagerQueue(^{
      RCTBaseTextInputShadowView *shadowView =
          (RCTBaseTextInputShadowView *)[self.bridge.uiManager shadowViewForReactTag:viewTag];
      if (value) {
        [shadowView setText:value];
      }
      [self.bridge.uiManager setNeedsLayout];
      RCTExecuteOnMainQueue(^{
        [view setSelectionStart:start selectionEnd:end];
      });
    });
  }];
}

#pragma mark - RCTUIManagerObserver

- (void)uiManagerWillPerformMounting:(__unused RCTUIManager *)uiManager
{
  for (RCTBaseTextInputShadowView *shadowView in _shadowViews) {
    [shadowView uiManagerWillPerformMounting];
  }
}

#pragma mark - Font Size Multiplier

- (void)handleDidUpdateMultiplierNotification
{
  CGFloat fontSizeMultiplier =
      [[[self.bridge moduleForName:@"AccessibilityManager"] valueForKey:@"multiplier"] floatValue];

  NSHashTable<RCTBaseTextInputShadowView *> *shadowViews = _shadowViews;
  RCTExecuteOnUIManagerQueue(^{
    for (RCTBaseTextInputShadowView *shadowView in shadowViews) {
      shadowView.textAttributes.fontSizeMultiplier = fontSizeMultiplier;
      [shadowView dirtyLayout];
    }

    [self.bridge.uiManager setNeedsLayout];
  });
}
#else
- (UIView *)view
{
  return [[PasteInputView alloc] initWithBridge:self.bridge];
}
#endif
@end
