//
//  MainViewController.m
//  NBGI
//
//  Created by Cameron McKay on 2/26/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "MainViewController.h"
#import "SocketIOPacket.h"
#import "SearchingForOpponent.h"
#import "Connect4ViewController.h"

@interface MainViewController ()

- (IBAction)PlayConnect4:(id)sender;

@end

typedef void (^success)(NSString *responseData);
SocketIO* gameSocket = NULL;
const int GAME_SOCKET_PORT = 10089;

@implementation MainViewController

+ (SocketIO*) GameSocket {
    return gameSocket;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}


- (BOOL)shouldAutorotate {
    return YES;
}

- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskAll;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    success responseSuccess;
    //callback method defined
    responseSuccess = ^(NSString *data){
        NSLog(@"I get here: Handle Server response called");
        NSLog(@"the data returned is: %@", data);
        
        NSData *responseJSON = [data dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error = NULL;
        NSDictionary *jsonNSDict = [NSJSONSerialization JSONObjectWithData:responseJSON options:NSJSONReadingMutableContainers error:&error];
        
        if (error != NULL) {
            NSLog(@" error => %@ ", error);
        }
        else {
            NSLog(@"didReceiveEvent >>> data: %@", jsonNSDict);
            NSDictionary *userDict = [jsonNSDict objectForKey:@"user"];
            
            if (userDict == nil) {
                NSLog(@"Error: User data was not returned in response.");
            }
            else {
                NSLog(@"User id received from initialize is %@",[userDict objectForKey:@"userID"]);
                _player = [[Player alloc] initWithUserIDAndNameAndisOnlineAndAvatarURL:[[userDict objectForKey:@"userID"] intValue] userName:[userDict objectForKey:@"userName"] isOnline:[userDict objectForKey:@"isOnline"] avatarURL:[userDict objectForKey:@"avatarURL"]];
                [self setupGameSocketConnection];
            }
        }
    };

    [self sendHttpGetRequest: responseSuccess url: @"initialize"];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (void)sendHttpGetRequest: (void (^)(NSString *responseData))success url:(NSString *) url
{
    NSMutableString *s = [[NSMutableString alloc]init];
    [s appendString:@"http://54.186.37.75/"];
    [s appendString:url];
    NSString *urlPath = [NSString stringWithString:s];
    
    NSURL *nsurl = [NSURL URLWithString:urlPath];
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:nsurl];
    
    NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [NSURLConnection sendAsynchronousRequest:urlRequest queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *error)
     {
         if (error)
         {
             NSLog(@"Error,%@", [error localizedDescription]);
         }
         else
         {
             NSString *response = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
             success(response);
             NSLog(@"Finished calling callback method");
         }
     }];
}

- (void)handleServerResponse:(NSString *)responseData
{
    NSLog(@"Handle Server Initialize Response");
}

- (void)setupGameSocketConnection {
    gameSocket = [[SocketIO alloc] initWithDelegate:self];
    [gameSocket connectToHost:@"54.186.37.75" onPort:GAME_SOCKET_PORT];
}

- (IBAction)PlayConnect4:(id)sender {
    NSMutableString *queueForGameUrl = [[NSMutableString alloc] initWithString:@"queueForGame?"];
    success responseSuccess;

    responseSuccess = ^(NSString *data){
        //Do nothing
    };
    
    [queueForGameUrl appendString:@"userID="];
    [queueForGameUrl appendString:[_player.userID stringValue]];
    [queueForGameUrl appendString:@"&gameID="];
    [queueForGameUrl appendString:@"1"];//Connect4 game id is 1
    
    [self sendHttpGetRequest: responseSuccess url: queueForGameUrl];
}



- (void) socketIO:(SocketIO *)socket didReceiveEvent:(SocketIOPacket *)packet
{
    NSString *responseJSON = packet.data;
    NSData *responseJSONData = [responseJSON dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = NULL;
    NSMutableDictionary *jsonNSDict = [NSJSONSerialization JSONObjectWithData:responseJSONData options:NSJSONReadingMutableContainers error:&error];

    if (error != NULL) {
        NSLog(@"Error: Socket event had an error.");
    }
    else {
        NSString *eventName = [jsonNSDict objectForKeyedSubscript:@"name"];
        
        if ([eventName isEqualToString:@"matchFound"]) {
            [[NSNotificationCenter defaultCenter]
             postNotificationName:@"MatchFoundNotification"
             object:jsonNSDict];
        }
        else if ([eventName isEqualToString:@"receivePlayResult"]) {
            [[NSNotificationCenter defaultCenter]
             postNotificationName:@"PlayResultNotification"
             object:jsonNSDict];
        }
    }
}

- (void) socketIODidConnect:(SocketIO *)socket {
    NSMutableDictionary *user = [NSMutableDictionary dictionary];
    [user setObject:_player.userID forKey:@"userID"];
    [[MainViewController GameSocket] sendEvent:@"userSetup" withData:user];
}

- (void) socketIODidDisconnect:(SocketIO *)socket disconnectedWithError:(NSError *)error {
    [self setupGameSocketConnection];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"SearchForOpponent"]) {
        SearchingForOpponent *searchForOpponent = (SearchingForOpponent *)segue.destinationViewController;
        searchForOpponent.ownerPlayer = _player;
    }
}

- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender {
    return YES;
}

@end
