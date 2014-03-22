//
//  Player.h
//  NBGI
//
//  Created by Cameron McKay on 3/11/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ValidationController.h"

@interface Player : NSObject

- (Player *) initWithUserIDAndNameAndisOnlineAndAvatarURL: (int) userID userName: (NSString *) userName isOnline: (bool) isOnline avatarURL : (NSString *) avatarURL;
- (Player *) initWithJSONString:(NSString *) jsonString;
- (NSString *) CreateJSONString;

@property NSNumber *userID;
@property NSString *username;
@property bool isOnline;
@property NSString *avatarURL;

@end
