//
//  PasteInputManager.m
//
//  Created by Elias Nahum on 04-11-20.
//

#import "PasteInputManager.h"
#import "PasteInputView.h"

@implementation PasteInputManager

RCT_EXPORT_MODULE(PasteInput)

- (UIView *)view
{
  return [[PasteInputView alloc] initWithBridge:self.bridge];
}

#pragma mark - Multiline <TextInput> (aka TextView) specific properties

RCT_EXPORT_VIEW_PROPERTY(disableCopyPaste, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPaste, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(smartPunctuation, NSString*)


@end
