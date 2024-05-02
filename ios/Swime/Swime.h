#import <Foundation/Foundation.h>
#import "MimeType.h"
#import "SwimeUtils.h"

@interface Swime : NSObject

@property (nonatomic, readonly) NSData * _Nullable data;
@property (nonatomic, readonly) SwimeUtils * _Nullable utils;

+ (nullable MimeType *)mimeTypeWithData:(NSData *_Nullable)data;
+ (nullable MimeType *)mimeTypeWithBytes:(NSData *_Nullable)bytes;
+ (nullable MimeType *)mimeTypeWithSwime:(SwimeUtils *_Nullable)swime;

@end
