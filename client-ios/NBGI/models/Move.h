//
//  Move.h
//  NBGI
//
//  Created by Cameron McKay on 2/27/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ValidationController.h"

@interface Move : NSObject

- (Move *) initWithPositionAndUserID: (CGPoint) position userID: (int) userID;

@property CGPoint position;
@property NSNumber *userID;

@end
