#import <Foundation/Foundation.h>

@interface MimeTypeProxy : NSObject

@property (nonatomic, copy, readonly) NSString *mime;
@property (nonatomic, copy, readonly) NSString *ext;

- (instancetype)initWithMime:(NSString *)mime ext:(NSString *)ext;

@end

@interface SwimeProxy : NSObject

+ (instancetype)shared;
- (MimeTypeProxy *)getMimeFromUti:(NSString *)uti;
- (MimeTypeProxy *)getMimeAndExtension:(NSData *)data uti:(NSString *)uti;

@end
