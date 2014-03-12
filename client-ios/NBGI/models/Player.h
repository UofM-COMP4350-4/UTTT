//
//  Player.h
//  NBGI
//
//  Created by Cameron McKay on 3/11/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Player : NSObject

- (Player *) initWithUserIDAndName: (int) userID name: (NSString *) name;

@property NSNumber *userID;
@property NSString *name;

@end
