//
//  ValidationController.h
//  NBGI
//
//  Created by Cameron McKay on 3/12/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ValidationController : NSObject

+ (void) ValidateObject: (id) data;
+ (void) ValidateValue: (void *) data;

@end
