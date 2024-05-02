#import "SwimeUtils.h"

@implementation SwimeUtils

- (instancetype)initWithData:(NSData *)data {
    self = [super init];
    if (self) {
        _data = data;
    }
    return self;
}

- (instancetype)initWithBytes:(NSUInteger *)bytes length:(NSUInteger)length {
    NSData *data = [NSData dataWithBytes:bytes length:length];
    return [self initWithData:data];
}

- (NSData *)readBytesWithCount:(NSUInteger)count {
    NSMutableData *bytes = [NSMutableData dataWithLength:count];
    [self.data getBytes:bytes.mutableBytes length:count];
    return bytes;
}
@end
