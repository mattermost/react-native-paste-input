#import "MimeType.h"

@implementation MimeType

+ (NSArray<MimeType *> *)all {
    return @[
        [[MimeType alloc] initWithMime:@"image/jpeg"
                                   ext:@"jpg"
                                  type:FileTypeJPG
                           bytesCount:3
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 3) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return data[0] == 0xFF && data[1] == 0xD8 && data[2] == 0xFF;
        }],
        [[MimeType alloc] initWithMime:@"image/png"
                                   ext:@"png"
                                  type:FileTypePNG
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 4) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return data[0] == 0x89 && data[1] == 0x50 && data[2] == 0x4E && data[3] == 0x47;
        }],
        [[MimeType alloc] initWithMime:@"image/gif"
                                   ext:@"gif"
                                  type:FileTypeGIF
                           bytesCount:3
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 3) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return data[0] == 0x47 && data[1] == 0x49 && data[2] == 0x46;
        }],
        [[MimeType alloc] initWithMime:@"image/webp"
                                   ext:@"webp"
                                  type:FileTypeWEBP
                           bytesCount:12
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 12) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return data[8] == 0x57 && data[9] == 0x45 && data[10] == 0x42 && data[11] == 0x50;
        }],
        [[MimeType alloc] initWithMime:@"image/flif"
                                   ext:@"flif"
                                  type:FileTypeFLIF
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 4) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return data[0] == 0x46 && data[1] == 0x4C && data[2] == 0x49 && data[3] == 0x46;
        }],
        [[MimeType alloc] initWithMime:@"image/x-canon-cr2"
                                   ext:@"cr2"
                                  type:FileTypeCR2
                           bytesCount:10
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 10) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return ((data[0] == 0x49 && data[1] == 0x49 && data[2] == 0x2A && data[3] == 0x00) ||
                    (data[0] == 0x4D && data[1] == 0x4D && data[2] == 0x00 && data[3] == 0x2A)) &&
            (data[8] == 0x43 && data[9] == 0x52);
        }],
        [[MimeType alloc] initWithMime:@"image/tiff"
                                   ext:@"tif"
                                  type:FileTypeTIF
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 4) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return (data[0] == 0x49 && data[1] == 0x49 && data[2] == 0x2A && data[3] == 0x00) ||
            (data[0] == 0x4D && data[1] == 0x4D && data[2] == 0x00 && data[3] == 0x2A);
        }],
        [[MimeType alloc] initWithMime:@"image/bmp"
                                   ext:@"bmp"
                                  type:FileTypeBMP
                           bytesCount:2
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 2) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return data[0] == 0x42 && data[1] == 0x4D;
        }],
        [[MimeType alloc] initWithMime:@"image/vnd.ms-photo"
                                   ext:@"jxr"
                                  type:FileTypeJXR
                           bytesCount:3
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSUInteger length = bytes.length;
            if (length < 3) {
                return NO;
            }
            const uint8_t *data = bytes.bytes;
            return data[0] == 0x49 && data[1] == 0x49 && data[2] == 0xBC;
        }],
        [[MimeType alloc] initWithMime:@"image/vnd.adobe.photoshop"
                                   ext:@"psd"
                                  type:FileTypePSD
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
                                  NSUInteger length = bytes.length;
                                  if (length < 4) {
                                      return NO;
                                  }
                                  const uint8_t *data = bytes.bytes;
                                  return data[0] == 0x38 && data[1] == 0x42 && data[2] == 0x50 && data[3] == 0x53;
                              }],
                              [[MimeType alloc] initWithMime:@"video/x-m4v"
                                  ext:@"m4v"
                                 type:FileTypeM4V
                           bytesCount:11
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *expectedData = [NSData dataWithBytes:(const uint8_t[]){0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x56} length:11];
            return [bytes isEqualToData:expectedData];
        }],
        [[MimeType alloc] initWithMime:@"audio/midi"
                                  ext:@"mid"
                                 type:FileTypeMID
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *expectedData = [NSData dataWithBytes:(const uint8_t[]){0x4D, 0x54, 0x68, 0x64} length:4];
            return [bytes isEqualToData:expectedData];
        }],
        [[MimeType alloc] initWithMime:@"video/x-matroska"
                                  ext:@"mkv"
                                 type:FileTypeMKV
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (![bytes isEqualToData:[NSData dataWithBytes:(const uint8_t[]){0x1A, 0x45, 0xDF, 0xA3} length:4]]) {
                return NO;
            }
            
            NSData *data = [swime readBytesWithCount:4100];
            NSData *subData = [data subdataWithRange:NSMakeRange(4, 4096)];
            NSArray *_bytes = [NSArray arrayWithArray:[subData bytes]];
            
            NSInteger idPos = -1;
            for (NSInteger i = 0; i < _bytes.count - 1; i++) {
                if ([_bytes[i] isEqual:@(0x42)] && [_bytes[i + 1] isEqual:@(0x82)]) {
                    idPos = i;
                    break;
                }
            }
            
            if (idPos == -1) {
                return NO;
            }
            
            NSInteger docTypePos = idPos + 3;
            BOOL (^findDocType)(NSString *) = ^BOOL(NSString *type) {
                for (NSInteger i = 0; i < type.length; i++) {
                        unichar expectedChar = [type characterAtIndex:i];
                        if (docTypePos + i >= _bytes.count) {
                            return NO;
                        }
                    
                        UInt8 byteValue = [_bytes[docTypePos + i] unsignedCharValue];
                        if (byteValue != (UInt8)expectedChar) {
                            return NO;
                        }
                    }

                    return YES;
            };
            
            return findDocType(@"matroska");
        }],
        [[MimeType alloc] initWithMime:@"video/webm"
                                  ext:@"webm"
                                 type:FileTypeWEBM
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (![bytes isEqualToData:[NSData dataWithBytes:(const uint8_t[]){0x1A, 0x45, 0xDF, 0xA3} length:4]]) {
                return NO;
            }
            
            NSData *data = [swime readBytesWithCount:4100];
            NSData *subData = [data subdataWithRange:NSMakeRange(4, 4096)];
            NSArray *_bytes = [NSArray arrayWithArray:[subData bytes]];
            
            NSInteger idPos = -1;
            for (NSInteger i = 0; i < _bytes.count - 1; i++) {
                if ([_bytes[i] isEqual:@(0x42)] && [_bytes[i + 1] isEqual:@(0x82)]) {
                    idPos = i;
                    break;
                }
            }
            
            if (idPos == -1) {
                return NO;
            }
            
            NSInteger docTypePos = idPos + 3;
            BOOL (^findDocType)(NSString *) = ^BOOL(NSString *type) {
                for (NSInteger i = 0; i < type.length; i++) {
                        unichar expectedChar = [type characterAtIndex:i];
                        if (docTypePos + i >= _bytes.count) {
                            return NO;
                        }

                        UInt8 byteValue = [_bytes[docTypePos + i] unsignedCharValue];
                        if (byteValue != (UInt8)expectedChar) {
                            return NO;
                        }
                    }
                    return YES;
            };
            
            return findDocType(@"webm");
        }],
        [[MimeType alloc] initWithMime:@"video/quicktime"
                                  ext:@"mov"
                                 type:FileTypeMOV
                           bytesCount:8
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *expectedData = [NSData dataWithBytes:(const uint8_t[]){0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70} length:8];
            return [bytes isEqualToData:expectedData];
        }],
        [[MimeType alloc] initWithMime:@"video/x-msvideo"
                                  ext:@"avi"
                                 type:FileTypeAVI
                           bytesCount:11
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *expectedData1 = [NSData dataWithBytes:(const uint8_t[]){0x52, 0x49, 0x46, 0x46} length:4];
            NSData *expectedData2 = [NSData dataWithBytes:(const uint8_t[]){0x41, 0x56, 0x49} length:3];
            return [[bytes subdataWithRange:NSMakeRange(0, 4)] isEqualToData:expectedData1] && [[bytes subdataWithRange:NSMakeRange(8, 3)] isEqualToData:expectedData2];
        }],
        [[MimeType alloc] initWithMime:@"video/x-ms-wmv"
                                  ext:@"wmv"
                                 type:FileTypeWMV
                           bytesCount:10
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *expectedData = [NSData dataWithBytes:(const uint8_t[]){0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9} length:10];
            return [bytes isEqualToData:expectedData];
        }],
        [[MimeType alloc] initWithMime:@"video/mpeg"
                                  ext:@"mpg"
                                 type:FileTypeMPG
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (![[bytes subdataWithRange:NSMakeRange(0, 3)] isEqualToData:[NSData dataWithBytes:(const uint8_t[]){0x00, 0x00, 0x01} length:3]]) {
                return NO;
            }
            
            if (bytes.length >= 4) {
                uint8_t fourthByte;
                [bytes getBytes:&fourthByte range:NSMakeRange(3, 1)];
                NSString *hexCode = [NSString stringWithFormat:@"%02X", fourthByte];
                return hexCode.length > 0 && [hexCode characterAtIndex:0] == 'B';
            }
            return NO; // Handle edge case if bytes length is less than 4
        }],
        [[MimeType alloc] initWithMime:@"audio/mpeg"
                                   ext:@"mp3"
                                  type:FileTypeMP3
                           bytesCount:3
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 3)];
            NSData *pattern1 = [NSData dataWithBytes:(const uint8_t[]){0x49, 0x44, 0x33} length:3];
            NSData *pattern2 = [NSData dataWithBytes:(const uint8_t[]){0xFF, 0xFB} length:2];
            return [data isEqualToData:pattern1] || [data isEqualToData:pattern2];
        }],
        [[MimeType alloc] initWithMime:@"audio/m4a"
                                   ext:@"m4a"
                                  type:FileTypeM4A
                           bytesCount:11
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data1 = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *data2 = [bytes subdataWithRange:NSMakeRange(4, 7)];
            NSData *pattern1 = [NSData dataWithBytes:(const uint8_t[]){0x4D, 0x34, 0x41, 0x20} length:4];
            NSData *pattern2 = [NSData dataWithBytes:(const uint8_t[]){0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41} length:7];
            return [data1 isEqualToData:pattern1] || [data2 isEqualToData:pattern2];
        }],
        [[MimeType alloc] initWithMime:@"audio/opus"
                                   ext:@"opus"
                                  type:FileTypeOPUS
                           bytesCount:36
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(28, 8)];
            NSData *pattern = [NSData dataWithBytes:(const uint8_t[]){0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64} length:8];
            return [data isEqualToData:pattern];
        }],
        [[MimeType alloc] initWithMime:@"audio/ogg"
                                   ext:@"ogg"
                                  type:FileTypeOGG
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *pattern = [NSData dataWithBytes:(const uint8_t[]){0x4F, 0x67, 0x67, 0x53} length:4];
            return [data isEqualToData:pattern];
        }],
        [[MimeType alloc] initWithMime:@"audio/x-flac"
                                   ext:@"flac"
                                  type:FileTypeFLAC
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *pattern = [NSData dataWithBytes:(const uint8_t[]){0x66, 0x4C, 0x61, 0x43} length:4];
            return [data isEqualToData:pattern];
        }],
        [[MimeType alloc] initWithMime:@"audio/x-wav"
                                   ext:@"wav"
                                  type:FileTypeWAV
                           bytesCount:12
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data1 = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *data2 = [bytes subdataWithRange:NSMakeRange(8, 4)];
            NSData *pattern1 = [NSData dataWithBytes:(const uint8_t[]){0x52, 0x49, 0x46, 0x46} length:4];
            NSData *pattern2 = [NSData dataWithBytes:(const uint8_t[]){0x57, 0x41, 0x56, 0x45} length:4];
            return [data1 isEqualToData:pattern1] && [data2 isEqualToData:pattern2];
        }],
        [[MimeType alloc] initWithMime:@"audio/amr"
                                   ext:@"amr"
                                  type:FileTypeAMR
                           bytesCount:6
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 6)];
            NSData *pattern = [NSData dataWithBytes:(const uint8_t[]){0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A} length:6];
            return [data isEqualToData:pattern];
        }],
        [[MimeType alloc] initWithMime:@"application/pdf"
                                   ext:@"pdf"
                                  type:FileTypePdf
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 4) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x25 &&
                    dataBytes[1] == 0x50 &&
                    dataBytes[2] == 0x44 &&
                    dataBytes[3] == 0x46);
        }],
        [[MimeType alloc] initWithMime:@"application/x-msdownload"
                                   ext:@"exe"
                                  type:FileTypeExe
                           bytesCount:2
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 2) {
                return NO;
            }
                
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x4D && dataBytes[1] == 0x5A);
        }],
        [[MimeType alloc] initWithMime:@"application/x-shockwave-flash"
                                   ext:@"swf"
                                  type:FileTypeSwf
                           bytesCount:5
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 4) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x43 &&
                    dataBytes[1] == 0x46 &&
                    dataBytes[2] == 0x57 &&
                    dataBytes[3] == 0x53);
        }],
        [[MimeType alloc] initWithMime:@"application/rtf"
                                   ext:@"rtf"
                                  type:FileTypeRtf
                           bytesCount:5
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 5) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x7B &&
                    dataBytes[1] == 0x5C &&
                    dataBytes[2] == 0x72 &&
                    dataBytes[3] == 0x74 &&
                    dataBytes[4] == 0x66);
        }],
        [[MimeType alloc] initWithMime:@"application/font-woff"
                                   ext:@"woff"
                                  type:FileTypeWoff
                           bytesCount:8
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 8) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            BOOL isMagicNumberValid = (dataBytes[0] == 0x77 &&
                                       dataBytes[1] == 0x4F &&
                                       dataBytes[2] == 0x46 &&
                                       dataBytes[3] == 0x46);
            
            BOOL isFontVersionValid = ((dataBytes[4] == 0x00 &&
                                        dataBytes[5] == 0x01 &&
                                        dataBytes[6] == 0x00 &&
                                        dataBytes[7] == 0x00) ||
                                       (dataBytes[4] == 0x4F &&
                                        dataBytes[5] == 0x54 &&
                                        dataBytes[6] == 0x54 &&
                                        dataBytes[7] == 0x4F));
            
            return (isMagicNumberValid && isFontVersionValid);
        }],
        [[MimeType alloc] initWithMime:@"application/font-woff"
                                   ext:@"woff2"
                                  type:FileTypeWoff2
                           bytesCount:8
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 8) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            BOOL isMagicNumberValid = (dataBytes[0] == 0x77 &&
                                       dataBytes[1] == 0x4F &&
                                       dataBytes[2] == 0x46 &&
                                       dataBytes[3] == 0x32);
            BOOL isFontVersionValid = ((dataBytes[4] == 0x00 &&
                                        dataBytes[5] == 0x01 &&
                                        dataBytes[6] == 0x00 &&
                                        dataBytes[7] == 0x00) ||
                                       (dataBytes[4] == 0x4F &&
                                        dataBytes[5] == 0x54 &&
                                        dataBytes[6] == 0x54 &&
                                        dataBytes[7] == 0x4F));
            
            return (isMagicNumberValid && isFontVersionValid);
        }],
        [[MimeType alloc] initWithMime:@"application/octet-stream"
                                   ext:@"eot"
                                  type:FileTypeEot
                           bytesCount:36
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 36) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            BOOL isMagicNumberValid = (dataBytes[34] == 0x4C && dataBytes[35] == 0x50);
            BOOL isFontVersionValid = ((dataBytes[8] == 0x00 && dataBytes[9] == 0x00 && dataBytes[10] == 0x01) ||
                                       (dataBytes[8] == 0x01 && dataBytes[9] == 0x00 && dataBytes[10] == 0x02) ||
                                       (dataBytes[8] == 0x02 && dataBytes[9] == 0x00 && dataBytes[10] == 0x02));
            
            return (isMagicNumberValid && isFontVersionValid);
        }],
        [[MimeType alloc] initWithMime:@"application/font-sfnt"
                                   ext:@"ttf"
                                  type:FileTypeTtf
                           bytesCount:5
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 5) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x00 &&
                    dataBytes[1] == 0x01 &&
                    dataBytes[2] == 0x00 &&
                    dataBytes[3] == 0x00 &&
                    dataBytes[4] == 0x00);
        }],
        [[MimeType alloc] initWithMime:@"application/font-sfnt"
                                   ext:@"otf"
                                  type:FileTypeOtf
                           bytesCount:5
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 5) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x4F &&
                    dataBytes[1] == 0x54 &&
                    dataBytes[2] == 0x54 &&
                    dataBytes[3] == 0x4F &&
                    dataBytes[4] == 0x00);
        }],
        [[MimeType alloc] initWithMime:@"image/x-icon"
                                   ext:@"ico"
                                  type:FileTypeIco
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 4) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x00 &&
                    dataBytes[1] == 0x00 &&
                    dataBytes[2] == 0x01 &&
                    dataBytes[3] == 0x00);
        }],
        [[MimeType alloc] initWithMime:@"video/x-flv"
                                   ext:@"flv"
                                  type:FileTypeFlv
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 4) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x46 &&
                    dataBytes[1] == 0x4C &&
                    dataBytes[2] == 0x56 &&
                    dataBytes[3] == 0x01);
        }],
        [[MimeType alloc] initWithMime:@"application/postscript"
                                   ext:@"ps"
                                  type:FileTypePs
                           bytesCount:2
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 2) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x25 &&
                    dataBytes[2] == 0x21);
        }],
        [[MimeType alloc] initWithMime:@"application/x-xz"
                                   ext:@"xz"
                                  type:FileTypeXz
                           bytesCount:6
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 6) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0xFD &&
                    dataBytes[1] == 0x37 &&
                    dataBytes[2] == 0x7A &&
                    dataBytes[3] == 0x58 &&
                    dataBytes[4] == 0x5A &&
                    dataBytes[5] == 0x00);
        }],
        [[MimeType alloc] initWithMime:@"application/x-sqlite3"
                                   ext:@"sqlite"
                                  type:FileTypeSqlite
                           bytesCount:4
                              matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 4) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x53 &&
                    dataBytes[1] == 0x51 &&
                    dataBytes[2] == 0x4C &&
                    dataBytes[3] == 0x69);
        }],
        [[MimeType alloc] initWithMime:@"application/x-nintendo-nes-rom"
                                   ext:@"nes"
                                  type:FileTypeNes
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            if (bytes.length < 4) {
                return NO;
            }
            
            const uint8_t *dataBytes = bytes.bytes;
            return (dataBytes[0] == 0x4E &&
                    dataBytes[1] == 0x45 &&
                    dataBytes[2] == 0x53 &&
                    dataBytes[3] == 0x1A);
        }],
        [[MimeType alloc] initWithMime:@"application/x-google-chrome-extension"
                                  ext:@"crx"
                                 type:FileTypeCrx
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *expected = [NSData dataWithBytes:(const uint8_t[]){0x43, 0x72, 0x32, 0x34} length:4];
            return [data isEqualToData:expected];
        }],
        [[MimeType alloc] initWithMime:@"application/vnd.ms-cab-compressed"
                                  ext:@"cab"
                                 type:FileTypeCab
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *expected1 = [NSData dataWithBytes:(const uint8_t[]){0x4D, 0x53, 0x43, 0x46} length:4];
            NSData *expected2 = [NSData dataWithBytes:(const uint8_t[]){0x49, 0x53, 0x63, 0x28} length:4];
            return [data isEqualToData:expected1] || [data isEqualToData:expected2];
        }],
        [[MimeType alloc] initWithMime:@"application/x-deb"
                                  ext:@"deb"
                                 type:FileTypeDeb
                           bytesCount:21
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 21)];
            NSData *expected = [NSData dataWithBytes:(const uint8_t[]){
                0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E, 0x0A, 0x64, 0x65, 0x62, 0x69,
                0x61, 0x6E, 0x2D, 0x62, 0x69, 0x6E, 0x61, 0x72, 0x79
            } length:21];
            return [data isEqualToData:expected];
        }],
        [[MimeType alloc] initWithMime:@"application/x-unix-archive"
                                  ext:@"ar"
                                 type:FileTypeAr
                           bytesCount:7
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 7)];
            NSData *expected = [NSData dataWithBytes:(const uint8_t[]){0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E} length:7];
            return [data isEqualToData:expected];
        }],
        [[MimeType alloc] initWithMime:@"application/x-rpm"
                                  ext:@"rpm"
                                 type:FileTypeRpm
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *expected = [NSData dataWithBytes:(const uint8_t[]){0xED, 0xAB, 0xEE, 0xDB} length:4];
            return [data isEqualToData:expected];
        }],
        [[MimeType alloc] initWithMime:@"application/x-compress"
                                  ext:@"Z"
                                 type:FileTypeZ
                           bytesCount:2
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 2)];
            NSData *expected1 = [NSData dataWithBytes:(const uint8_t[]){0x1F, 0xA0} length:2];
            NSData *expected2 = [NSData dataWithBytes:(const uint8_t[]){0x1F, 0x9D} length:2];
            return [data isEqualToData:expected1] || [data isEqualToData:expected2];
        }],
        [[MimeType alloc] initWithMime:@"application/x-lzip"
                                  ext:@"lz"
                                 type:FileTypeLz
                           bytesCount:4
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 4)];
            NSData *expected = [NSData dataWithBytes:(const uint8_t[]){0x4C, 0x5A, 0x49, 0x50} length:4];
            return [data isEqualToData:expected];
        }],
        [[MimeType alloc] initWithMime:@"application/x-msi"
                                  ext:@"msi"
                                 type:FileTypeMsi
                           bytesCount:8
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 8)];
            NSData *expected = [NSData dataWithBytes:(const uint8_t[]){0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1} length:8];
            return [data isEqualToData:expected];
        }],
        [[MimeType alloc] initWithMime:@"application/mxf"
                                  ext:@"mxf"
                                 type:FileTypeMxf
                           bytesCount:14
                               matches:^BOOL(NSData *bytes, SwimeUtils *swime) {
            NSData *data = [bytes subdataWithRange:NSMakeRange(0, 14)];
            NSData *expected = [NSData dataWithBytes:(const uint8_t[]){0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02} length:14];
            return [data isEqualToData:expected];
        }]
    ];
}

- (instancetype)initWithMime:(NSString *)mime
                         ext:(NSString *)ext
                        type:(FileType)type
                 bytesCount:(NSInteger)bytesCount
                    matches:(BOOL (^)(NSData *, SwimeUtils *))matches {
    self = [super init];
    if (self) {
        _mime = mime;
        _ext = ext;
        _type = type;
        _bytesCount = bytesCount;
        _matches = [matches copy];
    }
    return self;
}

- (BOOL)matchesBytes:(NSData *)bytes swime:(SwimeUtils *)swime {
    return bytes.length >= self.bytesCount && self.matches(bytes, swime);
}

@end

