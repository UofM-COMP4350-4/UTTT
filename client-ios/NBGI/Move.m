//
//  Move.m
//  NBGI
//
//  Created by Cameron McKay on 2/27/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Move.h"

@implementation Move

- (Move *) initWithPositionAndUserID:(CGPoint)position userID:(int)userID {
    self = [super init];
    
    if (self) {
        [self setUserID:[NSNumber numberWithInt:userID]];
        [self setPosition:position];
    }
    
    return self;
}

@end
