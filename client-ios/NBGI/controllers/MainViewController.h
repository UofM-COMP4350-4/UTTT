//
//  MainViewController.h
//  NBGI
//
//  Created by Cameron McKay on 2/26/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SocketIO.h"
#import "Player.h"

@interface MainViewController : UIViewController <SocketIODelegate>
+ (SocketIO*) GameSocket;

@property NSNumber *userID;

@end
