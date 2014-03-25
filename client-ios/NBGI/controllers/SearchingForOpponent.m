//
//  SearchingForOpponent.m
//  NBGI
//
//  Created by Cameron McKay on 2014-03-25.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "SearchingForOpponent.h"
#import "Connect4ViewController.h"

@interface SearchingForOpponent ()

@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *SearchForOppSpinner;

@end

@implementation SearchingForOpponent

bool isMatchFound = false;
bool didViewAppear = false;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void) receiveNotification:(NSNotification *) notification
{
    if ([[notification name] isEqualToString:@"MatchFoundNotification"] && !isMatchFound) {
        NSDictionary *jsonNSDict = (NSDictionary *) [notification object];
        NSError *error;
        NSArray *args = [jsonNSDict objectForKeyedSubscript:@"args"];
        NSDictionary *argDict = args[0];
        
        if (error != NULL) {
            NSLog(@"Error: Could not create dictionary from arguments returned from event.");
        }
        else {
            _gameInstanceID = [[NSNumber alloc] initWithUnsignedLongLong:[[argDict objectForKey:@"instanceID"] unsignedLongLongValue]];
            
            NSDictionary *userToPlay = [argDict objectForKey:@"userToPlay"];
            int userToPlayID = [[userToPlay objectForKey:@"id"] intValue];
            NSString *userToPlayName = [userToPlay objectForKey:@"name"];
            _currentPlayersTurn = [[Player alloc]initWithUserIDAndNameAndisOnlineAndAvatarURL:userToPlayID userName:userToPlayName isOnline:false avatarURL:@"avatar.jpg"];
            
            if (didViewAppear) {
                [self performSegueWithIdentifier: @"PlayGameSegue" sender: self];
            }
            
            isMatchFound = true;
        }
        
        NSLog (@"Connect4ViewController received a match found notification. %@", jsonNSDict);
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(receiveNotification:)
                                                 name:@"MatchFoundNotification"
                                               object:nil];
    
    [_SearchForOppSpinner startAnimating];
}

-(void)viewDidAppear:(BOOL)animated
{
    didViewAppear = true;
    if (isMatchFound) {
        [self performSegueWithIdentifier: @"PlayGameSegue" sender: self];
    }
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"PlayGameSegue"]) {
        Connect4ViewController *connect4Controller = (Connect4ViewController *)segue.destinationViewController;
        connect4Controller.ownerPlayer = _ownerPlayer;
        connect4Controller.currentPlayersTurn = _currentPlayersTurn;
        connect4Controller.gameInstanceID = _gameInstanceID;
    }
}

- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender {
    return YES;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

@end
