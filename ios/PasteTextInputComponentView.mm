//
//  PasteTextInputComponentView.mm
//  react-native-paste-input
//
//  Stub ComponentView for iOS - actual paste handling done by PasteInputModule
//

#ifdef RCT_NEW_ARCH_ENABLED

#import "PasteTextInputComponentView.h"
#import <react/renderer/components/PasteTextInputSpecs/ComponentDescriptors.h>
#import <react/renderer/components/PasteTextInputSpecs/EventEmitters.h>
#import <react/renderer/components/PasteTextInputSpecs/Props.h>
#import <react/renderer/components/PasteTextInputSpecs/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface PasteTextInputComponentView () <RCTPasteTextInputViewProtocol>
@end

@implementation PasteTextInputComponentView

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<PasteTextInputComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // All initialization is handled by superclass (RCTTextInputComponentView)
    // The actual paste interception is done by PasteInputModule using dynamic subclassing
  }
  return self;
}

#pragma mark - RCTPasteTextInputViewProtocol

// These methods are already implemented by RCTTextInputComponentView
// We just need to declare conformance to the protocol for codegen

@end

Class<RCTComponentViewProtocol> PasteTextInputCls(void)
{
  return PasteTextInputComponentView.class;
}

#endif /* RCT_NEW_ARCH_ENABLED */
