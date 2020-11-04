//
//  PasteInputTextView.h
//  PasteInput
//
//  Created by Elias Nahum on 04-11-20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTUITextView.h>
#import <React/RCTComponent.h>

NS_ASSUME_NONNULL_BEGIN

@interface PasteInputTextView : RCTUITextView
    @property (nonatomic, assign) BOOL disableCopyPaste;
    @property (nonatomic, copy, nullable) RCTDirectEventBlock onPaste;
@end

NS_ASSUME_NONNULL_END
