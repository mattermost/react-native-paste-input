#import <Foundation/Foundation.h>

@interface SwimeUtils : NSObject

@property (nonatomic, readonly) NSData * _Nullable data;

- (instancetype _Nullable )initWithData:(NSData *_Nullable)data;
- (instancetype _Nullable )initWithBytes:(NSUInteger *_Nullable)bytes length:(NSUInteger)length;

- (NSData *_Nullable)readBytesWithCount:(NSUInteger)count;

@end
