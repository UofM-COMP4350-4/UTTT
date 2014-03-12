//
//  MainViewController.m
//  NBGI
//
//  Created by Cameron McKay on 2/26/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "MainViewController.h"
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
                
                clientID = [userDict objectForKey:@"userID"];
                gameList = [jsonNSDict objectForKey:@"availableGames"];
                NSLog(@"The game data contains: %@", [jsonNSDict objectForKey:@"availableGames"]);
                [[MainViewController GameSocket] sendEvent:@"userSetup" withData:[userDict objectForKey:@"userID"]];
            }
        }
    };
    
    [self sendHttpGetRequest: responseSuccess url: @"initialize"];
}

- (void)setupGameSocketConnection {
    gameSocket = [[SocketIO alloc] initWithDelegate:self];
    //[gameSocket connectToHost:@"localhost" onPort:GAME_SOCKET_PORT];
    [gameSocket connectToHost:@"54.186.20.243" onPort:GAME_SOCKET_PORT];
}

- (IBAction)PlayConnect4:(id)sender {
    NSNumber *connect4 = [[NSNumber alloc] initWithInt:2];
    int gameInstanceID = 96;
    NSMutableString *queueForGameUrl = [[NSMutableString alloc] initWithString:@"queueForGame?"];
    
    success responseSuccess;
    
    //Respond to the queue for game request
    responseSuccess = ^(NSString *data)
    {
        //check for 200 response header or other response headers
        NSLog(@"I get a queue response %@", data);
        
        /*
        NSError* error = NULL;
        NSString *jsonString;
        
        //send userID & gameID
        NSDictionary *queueInfo = [NSDictionary dictionaryWithObjectsAndKeys:clientID, @"userID", connect4, @"gameID", nil];
        
        
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:queueInfo
                                                           options:NSJSONWritingPrettyPrinted error:&error];
        
        if (error != nil) {
            NSLog(@" error => %@ ", error);
        }
        else {
            jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }*/
    };
    
    //Build queueForGame get request
    [queueForGameUrl appendString:@"clientID="];
    [queueForGameUrl appendString: [clientID stringValue]];
    [queueForGameUrl appendString:@"&gameID="];
    [queueForGameUrl appendString: [connect4 stringValue]];
    
    //Send queue for game request
    [self sendHttpGetRequest: responseSuccess url: queueForGameUrl];
    
    //Create a queueForGame http request
    //Call the matchmaking to match the two users
    
    // send http request to server to get an opponent to play against
    // set isGameCreatedSuccessfully to True if successful
    
    isGameCreatedSuccessfully = true;
    
    if (isGameCreatedSuccessfully) {
        [gameSocket sendEvent:@"gameCreated" withData:[NSNumber numberWithInt:gameInstanceID]];
    }
}

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
