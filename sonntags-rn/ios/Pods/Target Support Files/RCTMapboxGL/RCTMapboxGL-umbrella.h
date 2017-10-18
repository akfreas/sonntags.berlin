#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "MGLPolygon+RCTAdditions.h"
#import "MGLPolyline+RCTAdditions.h"
#import "RCTMapboxAnnotation.h"
#import "RCTMapboxAnnotationManager.h"
#import "RCTMapboxGL.h"
#import "RCTMapboxGLConversions.h"
#import "RCTMapboxGLManager.h"

FOUNDATION_EXPORT double MapboxVersionNumber;
FOUNDATION_EXPORT const unsigned char MapboxVersionString[];

