#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "PasteInputModule.h"
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ReactNativePasteInputExample";
  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

#ifdef RCT_NEW_ARCH_ENABLED
  // Set the reactHost for PasteInputModule (only needed if bridgeless mode is enabled)
  // This allows the module to find views by tag in bridgeless mode
  if (self.rootViewFactory.reactHost) {
    [PasteInputModule setReactHost:self.rootViewFactory.reactHost];
  }
#endif

  return result;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
 
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
