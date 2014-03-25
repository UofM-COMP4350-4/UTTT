//
//  Player.m
//  NBGI
//
//  Created by Cameron McKay on 3/11/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Player.h"

@implementation Player

- (Player *) initWithUserIDAndNameAndisOnlineAndAvatarURL: (int) userID userName: (NSString *) userName isOnline: (bool) isOnline avatarURL : (NSString *) avatarURL {
    [ValidationController ValidateObject:userName];
    [ValidationController ValidateObject:avatarURL];
    self = [super init];
    
    if (self) {
        [self setUserID:[NSNumber numberWithInt:userID]];
        [self setUsername:userName];
        [self setIsOnline:isOnline];
        [self setAvatarURL:avatarURL];
    }
    
    return self;
}

@end
