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
                [[MainViewController GameSocket] sendEvent:@"userSetup" withData:[userDict objectForKey:@"userID"]];
            }
        }
    };
    
    [self sendHttpGetRequest: responseSuccess url: @"initialize"];
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
    [s appendString:@"http://localhost/"];
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

- (void)handleServerResponse:(NSString *)responseData
{
    NSLog(@"Handle Server Initialize Response");
}

- (void)setupGameSocketConnection {
    gameSocket = [[SocketIO alloc] initWithDelegate:self];
    [gameSocket connectToHost:@"localhost" onPort:GAME_SOCKET_PORT];
}

- (IBAction)PlayConnect4:(id)sender {
    int gameInstanceID = 96;
    
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
