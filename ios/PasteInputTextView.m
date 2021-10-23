//
//  PasteInputTextView.m
//  PasteInput
//
//  Created by Elias Nahum on 04-11-20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "PasteInputTextView.h"
#import "UIPasteboard+GetImageInfo.h"

@implementation PasteInputTextView

#pragma mark - Overrides

- (BOOL)canPerformAction:(SEL)action withSender:(id)sender
{
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"
    BOOL prevent = action == @selector(paste:) ||
    action == @selector(copy:) ||
    action == @selector(cut:) ||
    action == @selector(_share:);
#pragma clang diagnostic pop
    
    if (_disableCopyPaste && prevent) {
        return NO;
    }
    
    if (action == @selector(paste:) && [UIPasteboard generalPasteboard].numberOfItems > 0) {
        return true;
    }
    
    return [super canPerformAction:action withSender:sender];
}

-(void)paste:(id)sender {
    [super paste:sender];
    
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];

    BOOL hasStrings = pasteboard.hasStrings;
    if (hasStrings) {
        NSArray<NSString *> *strs = pasteboard.strings;
        for (NSString *s in strs) {
            hasStrings = [s length] != 0 && ![s containsString:@"<img src="];
        }
    }
    if (pasteboard.hasURLs || hasStrings || pasteboard.hasColors) {
        return;
    }
    
    if (_onPaste) {
        NSArray<NSDictionary *> *files = [pasteboard getCopiedFiles];
        if (files != nil && files.count > 0) {
            _onPaste(@{
                @"data": files,
            });
        } else {
            return;
        }
    }
    
    // Dismiss contextual menu
    [self resignFirstResponder];
}

@end
