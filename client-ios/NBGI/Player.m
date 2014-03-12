//
//  Player.m
//  NBGI
//
//  Created by Cameron McKay on 3/11/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Player.h"

@implementation Player

- (Player *) initWithUserIDAndName:(int)userID name:(NSString *)name {
    self = [super init];
    
    if (self) {
        [self setUserID:[NSNumber numberWithInt:userID]];
        [self setName:name];
    }
    
    return self;
}

@end
