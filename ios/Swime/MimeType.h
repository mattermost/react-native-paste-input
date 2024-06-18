#import <Foundation/Foundation.h>
#import "SwimeUtils.h"

// FileType enumeration
typedef NS_ENUM(NSInteger, FileType) {
    FileTypeJPG,
    FileTypePNG,
    FileTypeGIF,
    FileTypeWEBP,
    FileTypeFLIF,
    FileTypeCR2,
    FileTypeTIF,
    FileTypeBMP,
    FileTypeJXR,
    FileTypePSD,
    FileTypeM4V,
    FileTypeMID,
    FileTypeMKV,
    FileTypeWEBM,
    FileTypeMOV,
    FileTypeAVI,
    FileTypeWMV,
    FileTypeMPG,
    FileTypeMP3,
    FileTypeM4A,
    FileTypeOPUS,
    FileTypeOGG,
    FileTypeFLAC,
    FileTypeWAV,
    FileTypeAMR,
    FileTypePdf,
    FileTypeExe,
    FileTypeSwf,
    FileTypeRtf,
    FileTypeWoff,
    FileTypeWoff2,
    FileTypeEot,
    FileTypeTtf,
    FileTypeOtf,
    FileTypeIco,
    FileTypeFlv,
    FileTypePs,
    FileTypeXz,
    FileTypeSqlite,
    FileTypeNes,
    FileTypeCrx,
    FileTypeCab,
    FileTypeDeb,
    FileTypeAr,
    FileTypeRpm,
    FileTypeZ,
    FileTypeLz,
    FileTypeMsi,
    FileTypeMxf
};

@interface MimeType : NSObject

@property (nonatomic, readonly) NSString *mime;
@property (nonatomic, readonly) NSString *ext;
@property (nonatomic, readonly) FileType type;
@property (nonatomic, readonly) NSInteger bytesCount;
//@property (nonatomic, copy) BOOL (^matches)(NSData *, id);
@property (nonatomic, copy) BOOL (^matches)(NSData *, SwimeUtils *);

- (BOOL)matchesBytes:(NSData *)bytes swime:(SwimeUtils *)swime;

+ (NSArray<MimeType *> *)all;

@end
