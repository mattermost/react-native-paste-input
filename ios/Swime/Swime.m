#import "Swime.h"

@implementation Swime

+ (nullable MimeType *)mimeTypeWithData:(NSData *)data {
    SwimeUtils *swime = [[SwimeUtils alloc] initWithData:data];
    return [self mimeTypeWithSwime:swime];
}

+ (nullable MimeType *)mimeTypeWithBytes:(NSData *)bytes {
    SwimeUtils *swime = [[SwimeUtils alloc] initWithBytes:(NSUInteger *)bytes.bytes length:bytes.length];
    return [self mimeTypeWithSwime:swime];
}

+ (nullable MimeType *)mimeTypeWithSwime:(SwimeUtils *)swime {
    NSUInteger count = MIN(swime.data.length, 262);
    NSData *data = [swime readBytesWithCount:count];

    for (MimeType *mime in MimeType.all) {
        if ([mime matchesBytes:data swime:swime]) {
            return mime;
        }
    }

    return nil;
}
@end

