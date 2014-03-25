//
//  SearchingForOpponent.h
//  NBGI
//
//  Created by Cameron McKay on 2014-03-25.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Player.h"

@interface SearchingForOpponent : UIViewController

@property Player* currentPlayersTurn;
@property Player* ownerPlayer;
@property NSNumber* gameInstanceID;

@end
