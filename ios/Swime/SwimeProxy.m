//
//  SwimeProxy.m
//  Mattermost
//
//  Created by Elias Nahum on 15-10-19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "Swime.h"
#import "SwimeProxy.h"

@implementation MimeTypeProxy

- (instancetype)initWithMime:(NSString *)mime ext:(NSString *)ext {
    self = [super init];
    if (self) {
        _mime = mime;
        _ext = ext;
    }
    return self;
}

@end

@implementation SwimeProxy

+ (instancetype)shared {
    static SwimeProxy *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[SwimeProxy alloc] init];
    });
    return sharedInstance;
}


- (MimeTypeProxy *)getMimeFromUti:(NSString *)uti {
    if ([uti isEqualToString:@"org.openxmlformats.openxml"]) {
        return [[MimeTypeProxy alloc] initWithMime:@"application/xml" ext:@".xml"];
    } else if ([uti isEqualToString:@"org.openxmlformats.wordprocessingml.document"]) {
        return [[MimeTypeProxy alloc] initWithMime:@"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ext:@".docx"];
    } else if ([uti isEqualToString:@"org.openxmlformats.spreadsheetml.sheet"]) {
        return [[MimeTypeProxy alloc] initWithMime:@"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ext:@".xlsx"];
    } else if ([uti isEqualToString:@"org.openxmlformats.presentationml.presentation"]) {
        return [[MimeTypeProxy alloc] initWithMime:@"application/vnd.openxmlformats-officedocument.presentationml.presentation" ext:@".pptx"];
    } else {
        return nil;
    }
}

- (MimeTypeProxy *)getMimeAndExtension:(NSData *)data uti:(NSString *)uti {
    MimeTypeProxy *mime = [self getMimeFromUti:uti];
    if (mime != nil) {
        return mime;
    }
    
    MimeType *proxy = [Swime mimeTypeWithData:data];
    if (proxy) {
        return [[MimeTypeProxy alloc] initWithMime:proxy.mime ext:proxy.ext];
    }
    
    return nil;
}

@end

