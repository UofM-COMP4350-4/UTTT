//
//  Move.h
//  NBGI
//
//  Created by Cameron McKay on 2/27/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ValidationController.h"
#import "Player.h"

@interface Move : NSObject

- (Move *) initWithPositionAndUser: (CGPoint) position user: (Player *) user;

@property CGPoint position;
@property Player *user;

@end
