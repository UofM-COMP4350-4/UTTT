//
//  BlahViewController.m
//  NBGI
//
//  Created by Cameron Mckay on 2014-02-27.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Connect4ViewController.h"
#import "SocketIOPacket.h"
#import "Move.h"

@interface Connect4ViewController ()

@end

@implementation Connect4ViewController

const NSString* blueChip = @"blueChip.png";
const NSString* redChip = @"redChip.png";
const NSString* whiteChip = @"whiteChip.png";
const int ROW_SIZE = 6;
const int COL_SIZE = 7;
const int userID = 12;
const int gameInstanceID = 96;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    //[self drawGameBoard:[[NSMutableArray alloc]init]];
    [self setupEvents];
    [self setupNotifications];
}

- (void)setupNotifications {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                          selector:@selector(receiveNotification:)
                                          name:@"MatchFoundNotification"
                                          object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                          selector:@selector(receiveNotification:)
                                          name:@"PlayResultNotification"
                                          object:nil];
}

- (void)setupEvents {
    UITapGestureRecognizer *singleFingerTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(playerMadeMove:)];
    [self.view addGestureRecognizer:singleFingerTap];
}

- (BOOL)shouldAutorotate
{
    if (([self interfaceOrientation] == [self supportedInterfaceOrientations]) )
    {
        return NO;
    }
    return YES;
}

- (NSUInteger)supportedInterfaceOrientations
{
    /*if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
     return UIInterfaceOrientationMaskAllButUpsideDown;
     } else {
     return UIInterfaceOrientationMaskAll;
     }*/
    return UIInterfaceOrientationMaskPortrait;
}

//The event handling method
- (void)playerMadeMove:(UITapGestureRecognizer *)recognizer {
    CGPoint location = [recognizer locationInView:[recognizer.view superview]];
    CGFloat touchX = location.x;
    CGRect screenRect = [[self view] bounds];
    CGFloat screenWidth = screenRect.size.width;
    int quadrantSize = screenWidth / COL_SIZE;
    int col = -1, index = 1, currentQuadrantMax = quadrantSize;
    
    while (col == -1) {
        if (touchX <= currentQuadrantMax) {
            col = index - 1;
        }
        else {
            if (index >= COL_SIZE) {
                col = COL_SIZE - 1;
            }
        }
        
        index++;
        currentQuadrantMax = quadrantSize * index;
    }
    
    NSString *moveJSON = [NSString stringWithFormat:@"{ \"user:\", \"x\":%d,\"y\":5 }",col];
    NSLog(@"player made a move im col %d", col);
    [[MainViewController GameSocket] sendEvent:@"receiveMove" withData:moveJSON];
}

- (void)initializeGameBoard {
    self.gameBoard = [[NSMutableArray alloc]init];

    for (int index = 0; index < 42; index++) {
        [self.gameBoard addObject:whiteChip];
    }
}

- (void)drawGameBoard:(NSMutableArray*) moveList {
    int gameBoardIndex = 0;
    int row = 0;
    int col = 0;
    int currUserID = 0;
    Move* currentMove;
    
    for (int index = 0; index < [moveList count]; index++) {
        currentMove = [moveList objectAtIndex:index];
        col = currentMove.position.x;
        row = currentMove.position.y;
        gameBoardIndex = ROW_SIZE*COL_SIZE - ((row * COL_SIZE)+(COL_SIZE- col));
        currUserID = [currentMove.userID intValue];
        
        if (currUserID == userID) {
            [self.gameBoard replaceObjectAtIndex:gameBoardIndex withObject:blueChip];
        }
        else {
            [self.gameBoard replaceObjectAtIndex:gameBoardIndex withObject:redChip];
        }
    }
    [self.collectionView reloadData];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) receiveNotification:(NSNotification *) notification// : (NSDictionary *) jsonDict
{
    // [notification name] should always be @"TestNotification"
    // unless you use this method for observation of other notifications
    // as well.
    
    if ([[notification name] isEqualToString:@"MatchFoundNotification"]) {
        [self initializeGameBoard];
        NSDictionary *jsonNSDict = (NSDictionary *) [notification object];
        NSError *error;
        //NSData *args = [jsonNSDict objectForKeyedSubscript:@"args"];
        NSArray *args = [jsonNSDict objectForKeyedSubscript:@"args"];
        NSDictionary *argDict = args[0];
        //NSDictionary *argDict = [NSJSONSerialization JSONObjectWithData:args options:NSJSONReadingMutableContainers error:&error];
        
        
        if (error != NULL) {
            NSLog(@"Error: Could not create dictionary from arguments returned from event.");
        }
        else {
            NSMutableArray *listOfMoves = [argDict objectForKey:@"currentBoard"];
            [self drawGameBoard:listOfMoves];
        }
        
        NSLog (@"Connect4ViewController received a match found notification. %@", jsonNSDict);
    }
    else if ([[notification name] isEqualToString:@"PlayResultNotification"]) {
        NSLog (@"Connect4ViewController received a play result notification.");
    }
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.gameBoard.count;
}


- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    static NSString *identifier = @"Cell";
    
    UICollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:identifier forIndexPath:indexPath];
    
    
    UIImageView *recipeImageView = (UIImageView *)[cell viewWithTag:100];
    recipeImageView.image = [UIImage imageNamed:[self.gameBoard objectAtIndex:indexPath.row]];
    
    return cell;
}

@end
