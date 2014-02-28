//
//  BlahViewController.m
//  NBGI
//
//  Created by Cameron Mckay on 2014-02-27.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "BlahViewController.h"

@interface BlahViewController ()

@end

@implementation BlahViewController

const NSString* blueChip = @"blueChip.png";
const NSString* redChip = @"redChip.png";
const NSString* whiteChip = @"whiteChip.png";
const int ROW_SIZE = 6;
const int COL_SIZE = 7;
const int userID = 12;

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
	// Do any additional setup after loading the view.
    [self initializeGameBoard];
    NSMutableArray* listOfMoves;
    listOfMoves = [self initializeMutableArray:listOfMoves];
    [self drawGameBoard:listOfMoves];
    
    UITapGestureRecognizer *singleFingerTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(playerMadeMove:)];
    [self.view addGestureRecognizer:singleFingerTap];
}

//The event handling method
- (void)playerMadeMove:(UITapGestureRecognizer *)recognizer {
    CGPoint location = [recognizer locationInView:[recognizer.view superview]];
    // translate screen coordinates into row and col
    // send message to server with location of move
}

-(NSMutableArray*)initializeMutableArray:(NSMutableArray*) listOfMoves {
    listOfMoves = [[NSMutableArray alloc]init];
    Move *move;
    
    for (int row = 0; row < 4; row++) {
        for (int col = 0; col < 5; col++) {
            move = [[Move alloc]init];
            move.position = CGPointMake(row, col);
            
            if (row % 2 == 0) {
                move.userID = 12;
            }
            else {
                move.userID = 17;
            }
            
            [listOfMoves addObject:move];
        }
    }
    
    return listOfMoves;
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
        gameBoardIndex = col * COL_SIZE + row;
        currUserID = currentMove.userID;
        
        if (currUserID == userID) {
            [self.gameBoard replaceObjectAtIndex:gameBoardIndex withObject:blueChip];
        }
        else {
            [self.gameBoard replaceObjectAtIndex:gameBoardIndex withObject:redChip];
        }
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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
