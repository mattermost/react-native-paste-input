//
//  PasteInputView.m
//  PasteInput
//
//  Created by Elias Nahum on 04-11-20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "PasteInputView.h"
#import "PasteInputTextView.h"
#import <React/RCTUtils.h>

@implementation PasteInputView
{
    PasteInputTextView *_backedTextInputView;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super initWithBridge:bridge]) {
    _backedTextInputView = [[PasteInputTextView alloc] initWithFrame:self.bounds];
    _backedTextInputView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _backedTextInputView.textInputDelegate = self;

    [self addSubview:_backedTextInputView];
  }

  return self;
}

- (id<RCTBackedTextInputViewProtocol>)backedTextInputView
{
  return _backedTextInputView;
}

- (void)setDisableCopyPaste:(BOOL)disableCopyPaste {
    _backedTextInputView.disableCopyPaste = disableCopyPaste;
}

- (void)setOnPaste:(RCTDirectEventBlock)onPaste {
    _backedTextInputView.onPaste = onPaste;
}

- (void)setSmartPunctuation:(NSString *)smartPunctuation {
    if ([smartPunctuation isEqualToString:@"enable"]) {
        [_backedTextInputView setSmartDashesType:UITextSmartDashesTypeYes];
        [_backedTextInputView setSmartQuotesType:UITextSmartQuotesTypeYes];
        [_backedTextInputView setSmartInsertDeleteType:UITextSmartInsertDeleteTypeYes];
    } else if ([smartPunctuation isEqualToString:@"disable"]) {
        [_backedTextInputView setSmartDashesType:UITextSmartDashesTypeNo];
        [_backedTextInputView setSmartQuotesType:UITextSmartQuotesTypeNo];
        [_backedTextInputView setSmartInsertDeleteType:UITextSmartInsertDeleteTypeNo];
    } else {
        [_backedTextInputView setSmartDashesType:UITextSmartDashesTypeDefault];
        [_backedTextInputView setSmartQuotesType:UITextSmartQuotesTypeDefault];
        [_backedTextInputView setSmartInsertDeleteType:UITextSmartInsertDeleteTypeDefault];
    }
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  RCTDirectEventBlock onScroll = self.onScroll;

  if (onScroll) {
    CGPoint contentOffset = scrollView.contentOffset;
    CGSize contentSize = scrollView.contentSize;
    CGSize size = scrollView.bounds.size;
    UIEdgeInsets contentInset = scrollView.contentInset;

    onScroll(@{
      @"contentOffset": @{
        @"x": @(contentOffset.x),
        @"y": @(contentOffset.y)
      },
      @"contentInset": @{
        @"top": @(contentInset.top),
        @"left": @(contentInset.left),
        @"bottom": @(contentInset.bottom),
        @"right": @(contentInset.right)
      },
      @"contentSize": @{
        @"width": @(contentSize.width),
        @"height": @(contentSize.height)
      },
      @"layoutMeasurement": @{
        @"width": @(size.width),
        @"height": @(size.height)
      },
      @"zoomScale": @(scrollView.zoomScale ?: 1),
    });
  }
}

@end
