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
#import "GameCompletedController.h"

@interface Connect4ViewController ()

@end

@implementation Connect4ViewController

const NSString* blueChip = @"blueChip.png";
const NSString* redChip = @"redChip.png";
const NSString* whiteChip = @"whiteChip.png";
const int ROW_SIZE = 6;
const int COL_SIZE = 7;
bool isOwnerWinner = false;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self setupEvents];
    [self initializeGameBoard];
    [self setupNotifications];
}

- (void)setupNotifications {
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
    return UIInterfaceOrientationMaskPortrait;
}

- (void)playerMadeMove:(UITapGestureRecognizer *)recognizer {
    CGPoint location = [recognizer locationInView:self.view];
    CGFloat touchX = location.x;
    CGRect screenRect = [[self view] bounds];
    CGFloat screenWidth = screenRect.size.width;
    int quadrantSize = screenWidth / COL_SIZE;
    int col = -1, index = 1, currentQuadrantMax = quadrantSize;
    
    if ([_currentPlayersTurn.userID intValue] == [_ownerPlayer.userID intValue]) {
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
        NSNumber* nsNumberCol = [[NSNumber alloc] initWithInt:col];
        NSNumber* nsNumberRow = [[NSNumber alloc] initWithInt:5];
        NSMutableDictionary* player = [NSMutableDictionary dictionary];
        NSMutableDictionary* moveJSON = [NSMutableDictionary dictionary];
        [player setObject:_ownerPlayer.userID forKey:@"id"];
        [player setObject:_ownerPlayer.username forKey:@"name"];
        [moveJSON setObject:player forKey:@"player"];
        [moveJSON setObject:nsNumberCol forKey:@"x"];
        [moveJSON setObject:nsNumberRow forKey:@"y"];
        [moveJSON setObject:_gameInstanceID forKey:@"instanceID"];
        NSLog(@"player made a move im col %d", col);
        [[MainViewController GameSocket] sendEvent:@"receiveMove" withData:moveJSON];
    }
    else {
        NSLog(@"It's not your turn JERK!!!!");
    }
}
    

- (void)initializeGameBoard {
    self.gameBoard = [[NSMutableArray alloc]init];

    for (int index = 0; index < 42; index++) {
        [self.gameBoard addObject:whiteChip];
    }
}

- (void)drawGameBoard:(NSMutableArray*) moveList {
    
    for (int index = 0; index < [moveList count]; index++) {
        NSDictionary* currentMove = [moveList objectAtIndex:index];
        NSDictionary* player = [currentMove objectForKey:@"player"];
        int col = [[currentMove objectForKey:@"x"] intValue];
        int row = [[currentMove objectForKey:@"y"] intValue];
        int gameBoardIndex = ROW_SIZE*COL_SIZE - ((row * COL_SIZE)+(COL_SIZE - col));
        int currUserID = [[player objectForKey:@"id"] intValue];
        
        if (currUserID == [_ownerPlayer.userID intValue]) {
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
}

- (void) receiveNotification:(NSNotification *) notification
{
    if ([[notification name] isEqualToString:@"PlayResultNotification"]) {
        NSLog (@"Connect4ViewController received a play result notification.");
        NSDictionary *jsonNSDict = (NSDictionary *) [notification object];
        NSArray *args = [jsonNSDict objectForKeyedSubscript:@"args"];
        NSDictionary *argDict = args[0];
        NSMutableArray *listOfMoves = [argDict objectForKey:@"currentBoard"];
        [self drawGameBoard:listOfMoves];
        
        NSDictionary *userToPlay = [argDict objectForKey:@"userToPlay"];
        NSDictionary *winner = [argDict objectForKey:@"winner"];
        
        if (![winner isKindOfClass:[NSNull class]]) {
            NSNumber *userID = [winner objectForKey:@"id"];
            if ([userID compare:_ownerPlayer.userID] == 0) {
                isOwnerWinner = true;
            }
            else {
                isOwnerWinner = false;
            }
            [self performSegueWithIdentifier: @"GameCompletedSegue" sender: self];
        }
        
        int userToPlayID = [[userToPlay objectForKey:@"id"] intValue];
        NSString *userToPlayName = [userToPlay objectForKey:@"name"];
        _currentPlayersTurn = [[Player alloc]initWithUserIDAndNameAndisOnlineAndAvatarURL:userToPlayID userName:userToPlayName isOnline:false avatarURL:@"avatar.jpg"];
    }
    else if ([[notification name] isEqualToString:@"ChatNotification"]) {
        // Handle received chat messages here
    }
}

- (void)sendChat:(NSString*) chatMsg {
    NSDate *date = [NSDate date];
    double time = floor([date timeIntervalSince1970] *1000);
    NSNumber* nsNumberTime = [[NSNumber alloc] initWithDouble:time];
    NSMutableDictionary* player = [NSMutableDictionary dictionary];
    NSMutableDictionary* chatJSON = [NSMutableDictionary dictionary];
    [player setObject:_ownerPlayer.userID forKey:@"id"];
    [player setObject:_ownerPlayer.username forKey:@"name"];
    [chatJSON setObject:player forKey:@"player"];
    [chatJSON setObject:chatMsg forKey:@"message"];
    [chatJSON setObject:nsNumberTime forKey:@"timestamp"];
    [chatJSON setObject:_gameInstanceID forKey:@"instanceID"];
    [[MainViewController GameSocket] sendEvent:@"chat" withData:chatJSON];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"GameCompletedSegue"]) {
        GameCompletedController *gameCompletedController = (GameCompletedController *)segue.destinationViewController;
        gameCompletedController.isWinner = isOwnerWinner;
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
