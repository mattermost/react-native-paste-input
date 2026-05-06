//
//  PasteInputModule.mm
//  react-native-paste-input
//
//  TurboModule implementation for paste interception using dynamic subclassing
//

#import "PasteInputModule.h"
#import "UIPasteboard+GetImageInfo.h"

#import <React/RCTUIManager.h>
#import <objc/runtime.h>
#import <objc/message.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <PasteTextInputSpecs/PasteTextInputSpecs.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <React/RCTFabricSurface.h>
#import <React/RCTMountingManager.h>
#import <React/RCTComponentViewRegistry.h>
#import <React/RCTUIManager.h>
#endif

// Associated object keys
static const char *kOriginalClassKey = "PasteInputOriginalClass";
static const char *kPasteInputConfigKey = "PasteInputConfig";
static const char *kPasteInputModuleKey = "PasteInputModule";
static const char *kPasteInputNativeIDKey = "PasteInputNativeID";

// Forward declarations for IMP functions
static void pasteInputInterceptedPasteIMP(id self, SEL _cmd, id sender);
static BOOL pasteInputCanPerformActionIMP(id self, SEL _cmd, SEL action, id sender);

@interface PasteInputModule ()
@property (nonatomic, strong) NSMutableDictionary<NSString *, UIView *> *registeredViews;
@end

static id _reactHost = nil;

@implementation PasteInputModule

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

+ (void)setup:(RCTRootViewFactory *)rootViewFactory
{
#ifdef RCT_NEW_ARCH_ENABLED
    _reactHost = rootViewFactory.reactHost;
#endif
}

- (instancetype)init
{
    if (self = [super init]) {
        _registeredViews = [NSMutableDictionary new];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onPaste"];
}

// MARK: - TurboModule Methods

/**
 * Register a TextInput for paste interception
 */
- (void)registerTextInput:(NSString *)nativeID
                   config:(JS::NativePasteInputModule::PasteInputConfig &)config
{
    // Extract tag from nativeID format "PasteInput_{tag}"
    NSArray *components = [nativeID componentsSeparatedByString:@"_"];
    if (components.count < 2) {
#ifdef DEBUG
        NSLog(@"[PasteInput] Invalid nativeID format: %@", nativeID);
#endif
        return;
    }

    NSInteger viewTag = [components[1] integerValue];
    NSNumber *viewRef = @(viewTag);

    // Convert config struct to NSDictionary
    NSDictionary *configDict = @{
        @"disableCopyPaste": @(config.disableCopyPaste().value_or(false)),
        @"smartPunctuation": config.smartPunctuation() ?: @"default"
    };

    // Try to find the view with retry logic (view might not be mounted yet)
    [self findAndRegisterViewWithTag:viewRef nativeID:nativeID config:configDict retryCount:0];
}

- (void)findAndRegisterViewWithTag:(NSNumber *)viewRef nativeID:(NSString *)nativeID config:(NSDictionary *)configDict retryCount:(NSInteger)retryCount
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *view = [self findBackingTextViewForTag:viewRef];
        if (view) {
            // Store the view using nativeID as key
            self.registeredViews[nativeID] = view;

            // Apply dynamic subclassing for paste interception
            [self applyDynamicSubclassing:view config:configDict nativeID:nativeID];
        } else if (retryCount < 10) {
            // Retry after a short delay (view might not be mounted yet)
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.05 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self findAndRegisterViewWithTag:viewRef nativeID:nativeID config:configDict retryCount:retryCount + 1];
            });
        }
    });
}

/**
 * Unregister a TextInput
 */
- (void)unregisterTextInput:(NSString *)nativeID
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *view = self.registeredViews[nativeID];
        if (view) {
            [self removeDynamicSubclassing:view];
            [self.registeredViews removeObjectForKey:nativeID];
        }
    });
}

// Required for RCTEventEmitter
- (void)addListener:(NSString *)eventName
{
    // Required by RCTEventEmitter - this tracks listener count
    // Don't need to do anything here, but the method must exist
    [super addListener:eventName];
}

- (void)removeListeners:(double)count
{
    // Required by RCTEventEmitter - this tracks listener count
}

#pragma mark - View Resolution

/**
 * Get surface presenter - works in both bridgeless and bridge modes
 */
- (nullable id)getSurfacePresenter
{
#ifdef RCT_NEW_ARCH_ENABLED
    // Try bridgeless mode first (if reactHost is set)
    if (_reactHost) {
        return [_reactHost performSelector:@selector(surfacePresenter)];
    }
    // Fallback to bridge mode (Fabric with bridge enabled)
    else if (self.bridge) {
        // self.bridge.surfacePresenter returns RCTSurfacePresenterBridgeAdapter
        RCTSurfacePresenterBridgeAdapter *adapter = self.bridge.surfacePresenter;
        if (adapter && [adapter respondsToSelector:@selector(surfacePresenter)]) {
            return adapter.surfacePresenter;
        }
        // If that fails, the adapter itself might be the surface presenter
        return adapter;
    }
#endif
    return nil;
}

/**
 * Find the backing UITextView/UITextField using view tag
 * In Fabric with bridgeless mode, we use the reactHost to access ComponentViewRegistry
 * In Fabric without bridgeless (with bridge), we use the bridge's UIManager
 */
- (nullable UIView *)findBackingTextViewForTag:(NSNumber *)viewRef
{
    UIView *view = nil;


#ifdef RCT_NEW_ARCH_ENABLED
    id surfacePresenter = [self getSurfacePresenter];
    if (surfacePresenter) {

        // Get mountingManager from surfacePresenter
        id mountingManager = [surfacePresenter performSelector:@selector(mountingManager)];
        if (mountingManager) {

            // Get componentViewRegistry from mountingManager
            id componentViewRegistry = [mountingManager performSelector:@selector(componentViewRegistry)];
            if (componentViewRegistry) {

                // Find the view by tag
                SEL findSelector = @selector(findComponentViewWithTag:);
                if ([componentViewRegistry respondsToSelector:findSelector]) {
                    view = ((UIView *(*)(id, SEL, NSInteger))objc_msgSend)(componentViewRegistry, findSelector, [viewRef integerValue]);
                }
            }
        }
    }
#endif

    if (!view) {
        return nil;
    }


    // If it's already a text view, return it
    if ([view isKindOfClass:[UITextView class]] || [view isKindOfClass:[UITextField class]]) {
        return view;
    }

    // Otherwise, search subviews for the backing text view
    UIView *textView = [self findTextViewInHierarchy:view];
    return textView;
}

/**
 * Recursively search for a view with a specific nativeID
 */
- (nullable UIView *)findViewWithNativeID:(NSString *)nativeID inView:(UIView *)view
{
    // Check nativeID property (React Native Fabric sets this)
    if ([view respondsToSelector:@selector(nativeID)]) {
        NSString *viewNativeID = [view performSelector:@selector(nativeID)];
        if (viewNativeID && [viewNativeID isEqualToString:nativeID]) {
            return view;
        }
    }

    // Also check accessibilityIdentifier as fallback
    if (view.accessibilityIdentifier && [view.accessibilityIdentifier isEqualToString:nativeID]) {
        return view;
    }

    for (UIView *subview in view.subviews) {
        UIView *found = [self findViewWithNativeID:nativeID inView:subview];
        if (found) {
            return found;
        }
    }
    return nil;
}

/**
 * Recursively search for UITextView or UITextField in view hierarchy
 */
- (nullable UIView *)findTextViewInHierarchy:(UIView *)view
{
    for (UIView *subview in view.subviews) {
        if ([subview isKindOfClass:[UITextView class]] || [subview isKindOfClass:[UITextField class]]) {
            return subview;
        }

        UIView *found = [self findTextViewInHierarchy:subview];
        if (found) {
            return found;
        }
    }
    return nil;
}

#pragma mark - Dynamic Subclassing

/**
 * Apply smart punctuation settings to the text view
 */
- (void)applySmartPunctuationSettings:(UIView *)view config:(NSDictionary *)config
{
    if (![view isKindOfClass:[UITextView class]] && ![view isKindOfClass:[UITextField class]]) {
        return;
    }

    NSString *smartPunctuation = config[@"smartPunctuation"];
    UITextSmartQuotesType smartQuotesType;
    UITextSmartDashesType smartDashesType;

    if ([smartPunctuation isEqualToString:@"enable"]) {
        smartQuotesType = UITextSmartQuotesTypeYes;
        smartDashesType = UITextSmartDashesTypeYes;
    } else if ([smartPunctuation isEqualToString:@"disable"]) {
        smartQuotesType = UITextSmartQuotesTypeNo;
        smartDashesType = UITextSmartDashesTypeNo;
    } else {
        // "default" - use system default
        smartQuotesType = UITextSmartQuotesTypeDefault;
        smartDashesType = UITextSmartDashesTypeDefault;
    }

    if ([view isKindOfClass:[UITextView class]]) {
        UITextView *textView = (UITextView *)view;
        textView.smartQuotesType = smartQuotesType;
        textView.smartDashesType = smartDashesType;
    } else if ([view isKindOfClass:[UITextField class]]) {
        UITextField *textField = (UITextField *)view;
        textField.smartQuotesType = smartQuotesType;
        textField.smartDashesType = smartDashesType;
    }
}

/**
 * Apply dynamic subclassing to intercept paste events
 */
- (void)applyDynamicSubclassing:(UIView *)view config:(NSDictionary *)config nativeID:(NSString *)nativeID
{
    Class originalClass = object_getClass(view);

    // Check if already subclassed
    if (objc_getAssociatedObject(view, kOriginalClassKey)) {
        // Already subclassed, just update config
        objc_setAssociatedObject(view, kPasteInputConfigKey, config, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        [self applySmartPunctuationSettings:view config:config];
        return;
    }

    // Store original class and config
    objc_setAssociatedObject(view, kOriginalClassKey, originalClass, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    objc_setAssociatedObject(view, kPasteInputConfigKey, config, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    objc_setAssociatedObject(view, kPasteInputModuleKey, self, OBJC_ASSOCIATION_ASSIGN);
    objc_setAssociatedObject(view, kPasteInputNativeIDKey, nativeID, OBJC_ASSOCIATION_RETAIN_NONATOMIC);

    // Apply smartPunctuation setting to UITextView/UITextField
    [self applySmartPunctuationSettings:view config:config];

    // Create dynamic subclass name
    NSString *className = NSStringFromClass(originalClass);
    NSString *dynamicClassName = [NSString stringWithFormat:@"PasteInput_%@_%p", className, view];

    // Check if dynamic class already exists
    Class dynamicClass = NSClassFromString(dynamicClassName);
    if (!dynamicClass) {
        // Create new dynamic subclass
        dynamicClass = objc_allocateClassPair(originalClass, [dynamicClassName UTF8String], 0);

        if (!dynamicClass) {
            return;
        }

        // Override paste: method
        Method pasteMethod = class_getInstanceMethod(originalClass, @selector(paste:));
        if (pasteMethod) {
            const char *encoding = method_getTypeEncoding(pasteMethod);
            class_addMethod(dynamicClass, @selector(paste:), (IMP)pasteInputInterceptedPasteIMP, encoding);
        }

        // Override canPerformAction:withSender:
        Method canPerformMethod = class_getInstanceMethod(originalClass, @selector(canPerformAction:withSender:));
        if (canPerformMethod) {
            const char *encoding = method_getTypeEncoding(canPerformMethod);
            class_addMethod(dynamicClass, @selector(canPerformAction:withSender:), (IMP)pasteInputCanPerformActionIMP, encoding);
        }

        // Register the class
        objc_registerClassPair(dynamicClass);
    }

    // Change the view's class (ISA swizzling)
    object_setClass(view, dynamicClass);
}

/**
 * Remove dynamic subclassing
 */
- (void)removeDynamicSubclassing:(UIView *)view
{
    Class originalClass = objc_getAssociatedObject(view, kOriginalClassKey);
    if (originalClass) {
        object_setClass(view, originalClass);
        objc_setAssociatedObject(view, kOriginalClassKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        objc_setAssociatedObject(view, kPasteInputConfigKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        objc_setAssociatedObject(view, kPasteInputModuleKey, nil, OBJC_ASSOCIATION_ASSIGN);
        objc_setAssociatedObject(view, kPasteInputNativeIDKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
}

#pragma mark - Intercepted Methods (C functions for IMP)

/**
 * Intercepted paste: implementation
 */
static void pasteInputInterceptedPasteIMP(id self, SEL _cmd, id sender)
{
    // Get the module and config
    PasteInputModule *module = objc_getAssociatedObject(self, kPasteInputModuleKey);
    NSString *nativeID = objc_getAssociatedObject(self, kPasteInputNativeIDKey);
    Class originalClass = objc_getAssociatedObject(self, kOriginalClassKey);

    if (!module || !nativeID) {
        if (originalClass) {
            struct objc_super superData = {
                .receiver = self,
                .super_class = originalClass
            };
            ((void(*)(struct objc_super *, SEL, id))objc_msgSendSuper)(&superData, _cmd, sender);
        }
        return;
    }

    // Check for files in pasteboard
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];

    // Quick check: Detect if pasteboard contains actual file data (images, documents, etc.)
    // Use hasImages as a fast indicator, then verify there's actual file content
    BOOL hasFileData = NO;

    // Check if pasteboard has images (most common file paste case)
    if (pasteboard.hasImages) {
        hasFileData = YES;
    } else {
        // For other file types, check pasteboard items
        // Exclude rich text formats (HTML, RTF, RTFD) which are just text representations
        NSArray<NSDictionary<NSString *, id> *> *items = pasteboard.items;

        for (NSDictionary *item in items) {
            for (NSString *type in item.allKeys) {
                // Skip text and rich text format types - these are not files
                if ([type isEqual:@"public.utf8-plain-text"] ||
                    [type isEqual:@"public.plain-text"] ||
                    [type isEqual:@"public.text"] ||
                    [type isEqual:@"public.html"] ||
                    [type isEqual:@"public.rtf"] ||
                    [type isEqual:@"com.apple.flat-rtfd"] ||
                    [type isEqual:@"public.url"] ||
                    [type hasPrefix:@"org.chromium."]) {
                    continue;
                }

                // Found a non-text type, likely a file
                hasFileData = YES;
                break;
            }
            if (hasFileData) break;
        }
    }

    // If no file data found (only text/rich-text), call original paste for text
    if (!hasFileData) {
        struct objc_super superData = {
            .receiver = self,
            .super_class = originalClass
        };
        ((void(*)(struct objc_super *, SEL, id))objc_msgSendSuper)(&superData, _cmd, sender);
        return;
    }

    // Pasteboard contains file data - do full extraction
    NSArray<NSDictionary *> *files = [pasteboard getCopiedFiles];

    if (files && files.count > 0) {
        // Emit event to JS
        // Check if any file dictionary contains an error and capture it
        NSString *error = nil;
        for (NSDictionary *fileInfo in files) {
            id errVal = fileInfo[@"error"]; // expecting string or NSNull
            if (errVal && errVal != [NSNull null]) {
                if ([errVal isKindOfClass:[NSString class]]) {
                    NSString *errStr = (NSString *)errVal;
                    if (errStr.length > 0) {
                        error = errStr;
                        break; // take the first non-empty error
                    }
                } else {
                    // If error is not a string, serialize its description
                    error = [errVal description];
                    if (error.length > 0) {
                        break;
                    }
                }
            }
        }

        // Build payload and include error if present
        NSMutableDictionary *payload = [@{
            @"nativeID": nativeID,
            @"data": files,
        } mutableCopy];
        if (error) {
            payload[@"error"] = error;
        }

        [module sendEventWithName:@"onPaste" body:payload];
    } else {
        // No files, call original paste (for text)
        struct objc_super superData = {
            .receiver = self,
            .super_class = originalClass
        };
        ((void(*)(struct objc_super *, SEL, id))objc_msgSendSuper)(&superData, _cmd, sender);
    }
}

/**
 * Intercepted canPerformAction:withSender: implementation
 */
static BOOL pasteInputCanPerformActionIMP(id self, SEL _cmd, SEL action, id sender)
{

    NSDictionary *config = objc_getAssociatedObject(self, kPasteInputConfigKey);
    BOOL disableCopyPaste = [config[@"disableCopyPaste"] boolValue];
    Class originalClass = objc_getAssociatedObject(self, kOriginalClassKey);

    if (disableCopyPaste) {
        if (action == @selector(paste:) ||
            action == @selector(copy:) ||
            action == @selector(cut:)) {
            return NO;
        }
    }

    // Special handling for paste: enable it if there's any content in pasteboard
    if (action == @selector(paste:)) {
        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];

        // Check if pasteboard has any items (images, files, text, etc.)
        BOOL hasContent = pasteboard.hasImages || pasteboard.hasURLs || pasteboard.hasStrings || pasteboard.numberOfItems > 0;

        if (hasContent) {
            return YES;
        }
    }

    // Call original implementation for other actions
    if (originalClass) {
        struct objc_super superData = {
            .receiver = self,
            .super_class = originalClass
        };
        BOOL result = ((BOOL(*)(struct objc_super *, SEL, SEL, id))objc_msgSendSuper)(&superData, _cmd, action, sender);
        return result;
    }

    return NO;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativePasteInputModuleSpecJSI>(params);
}
#endif

@end
