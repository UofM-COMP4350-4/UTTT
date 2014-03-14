//
//  MainViewController.m
//  NBGI
//
//  Created by Cameron McKay on 2/26/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "MainViewController.h"
#import "Connect4ViewController.h"
#import "SocketIOPacket.h"


@interface MainViewController ()

- (IBAction)PlayConnect4:(id)sender;

@end

//typedef void (^success)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON);
//defining a type of success we can reuse
typedef void (^success)(NSString *responseData);
SocketIO* gameSocket = NULL;
bool isGameCreatedSuccessfully = false;
const int GAME_SOCKET_PORT = 10089;
NSNumber *clientID = 0;
NSArray *gameList;
BOOL gameStarted =false;

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
    /*if (self.interfaceOrientation == self.supportedInterfaceOrientations)
    {
        return NO;
    }*/
    return YES;
}

- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskAll;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    [self initializeClient];
    [self setupGameSocketConnection];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)sendHttpGetRequest: (void (^)(NSString *responseData))success url:(NSString *) url
{
    NSMutableString *s = [[NSMutableString alloc]init];
    //[s appendString:@"http://localhost/"];
    [s appendString:@"http://54.186.20.243/"];
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
             //handle response from Server
             NSString *response = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
             success(response);
             NSLog(@"Finished calling callback method");
         }
     }];
}

- (void)initializeClient
{
    NSLog(@"Initialize Client method called");
    
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
                NSLog(@"The game data contains: %@", userDict);
                clientID = [userDict objectForKey:@"userID"];
                gameList = [jsonNSDict objectForKey:@"availableGames"];
                NSLog(@"The game data contains: %@", [jsonNSDict objectForKey:@"availableGames"]);
                //[[MainViewController GameSocket] sendEvent:@"userSetup" withData:[userDict objectForKey:@"userID"]];
                [[MainViewController GameSocket] sendEvent:@"userSetup" withData:@1];
            }
        }
    };
    
    [self sendHttpGetRequest: responseSuccess url: @"initialize"];
}

- (void)setupGameSocketConnection {
    gameSocket = [[SocketIO alloc] initWithDelegate:self];
    //[gameSocket connectToHost:@"localhost" onPort:GAME_SOCKET_PORT];
    [gameSocket connectToHost:@"54.186.20.243" onPort:GAME_SOCKET_PORT];
    [gameSocket setDelegate:self];
}
- (void) socketIO:(SocketIO *)socket didReceiveEvent:(SocketIOPacket *)packet
{
    NSLog(@"I'm recieving the event %@" , packet.data);
    isGameCreatedSuccessfully = true;
    NSError *error = NULL;
    NSData *responseJSON = [packet.data dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonNSDict = [NSJSONSerialization JSONObjectWithData:responseJSON options:NSJSONReadingMutableContainers error:&error];
    NSString *name = [jsonNSDict objectForKey:@"name"];
    
    //responseJSON = [packet.data dataUsingEncoding:NSUTF8StringEncoding];
    NSData *args = [jsonNSDict objectForKey:@"args"];
    NSLog(@"%@" , args);
    //jsonNSDict = [NSJSONSerialization JSONObjectWithData:args options:NSJSONReadingMutableContainers error:&error];
    
    
    if ([name isEqualToString:@"matchFound"]) {
        NSLog(@"%@" , name);
        NSNumber *gameInstanceID = [args valueForKey:@"gameInstanceID"];
        NSLog(@"%@" , gameInstanceID);
        [gameSocket sendEvent:@"gameCreated" withData:gameInstanceID];
    }
    else if  ([name isEqualToString:@"gameCreated"])
    {
        NSLog(@"Just touch it");
    }
    else
    {
        NSLog(@"Other event recieved");
    }
}

- (void) socketIO:(SocketIO *)socket didReceiveMessage:(SocketIOPacket *)packet
{
    NSLog(@"I'm recieving the message %@" , packet.data);
}

- (IBAction)PlayConnect4:(id)sender {
    NSNumber *connect4 = [[NSNumber alloc] initWithInt:2];
    //int gameInstanceID = 96;
    NSMutableString *queueForGameUrl = [[NSMutableString alloc] initWithString:@"queueForGame?"];
    //UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    
    success responseSuccess;
    //isGameCreatedSuccessfully = true;
    //Respond to the queue for game request
    responseSuccess = ^(NSString *data)
    {
        //check for 200 response header or other response headers
        NSLog(@"I get a queue response %@", data);
        //
        //SocketIOPacket* something = [[SocketIOPacket alloc] init ];
        
        
        //Wait for a socket event from server
        //[self socketIO:gameSocket didReceiveEvent:something gameInstanceID:gameInstanceID];
    };
    //gameStarted = true;
    //Build queueForGame get request
    [queueForGameUrl appendString:@"clientID="];
    //[queueForGameUrl appendString: [clientID stringValue]];
    [queueForGameUrl appendString:@"1"];
    [queueForGameUrl appendString:@"&gameID="];
    [queueForGameUrl appendString: [connect4 stringValue]];
    //[queueForGameUrl appendString:@"2"];
    
    //Send queue for game request
    [self sendHttpGetRequest: responseSuccess url: queueForGameUrl];
    
    //Create a queueForGame http request -done
    //Call the matchmaking to match the two users
    //Extend the IOSocket Delegate class and implement the didreceiveevent event
    
    //For now wait and release the waiting when the server returns
    /*while(!gameStarted)
    {
        spinner.center = CGPointMake(160, 240);
        [self.view addSubview:spinner];
        [spinner startAnimating];
    }*/
    
    // send http request to server to get an opponent to play against
    // set isGameCreatedSuccessfully to True if successful
    
    }
/*- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    if ([[segue identifier] isEqualToString:@"PlayGameSegue"]) {
        Connect4ViewController *myVC = [segue destinationViewController];
        myVC.playIndependent = YES; // set your properties here
    }
}*/
- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender {
    if ([identifier isEqualToString:@"PlayGameSegue"]) {
        NSLog(@"Segue Blocked");
        
        if (!isGameCreatedSuccessfully) {
            return NO;
        }
    }
    
    return YES;
}

@end
