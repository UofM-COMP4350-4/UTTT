//
//  Move.m
//  NBGI
//
//  Created by Cameron McKay on 2/27/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Move.h"

@implementation Move

- (Move *) initWithPositionAndUser:(CGPoint)position user: (Player *) user {
    self = [super init];
    
    if (self) {
        [self setUser:user];
        [self setPosition:position];
    }
    
    return self;
};

@end
