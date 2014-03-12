//
//  BlahViewController.h
//  NBGI
//
//  Created by Cameron Mckay on 2014-02-27.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <UIKit/UIKit.h>
#include "Move.h"
#include "MainViewController.h"
#import "SocketIO.h"

@interface BlahViewController : UICollectionViewController <SocketIODelegate>

@property NSMutableArray* gameBoard;

@end
