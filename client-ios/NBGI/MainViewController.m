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
    [self sendInitializeRequest];
    [self setupGameSocketConnection];
}

- (void)sendInitializeRequest
{

    NSString *s = @"http://localhost/initialize";
    NSURL *url = [NSURL URLWithString:s];
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:url];
    NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [NSURLConnection sendAsynchronousRequest:urlRequest queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *error)
     {
         if (error)
         {
             //return [error localizedDescription];
             NSLog(@"Error,%@", [error localizedDescription]);
         }
         else
         {
             //return [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
             //handle response from Server
             NSLog(@"%@", [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding]);
             [self handleServerResponse:[[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding]];
             NSLog(@"%@", [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding]);
         }
     }];
}

- (void)handleServerResponse:(NSString *)responseData
{
    int userID = 5;  // this is the ID returned from the initialize call
    NSLog(@"Handle Server Initialize Response");
    
    [gameSocket sendEvent:@"userSetup" withData:[NSNumber numberWithInt:userID]];
}

- (void)setupGameSocketConnection {
    gameSocket = [[SocketIO alloc] initWithDelegate:self];
    [gameSocket connectToHost:@"localhost" onPort:GAME_SOCKET_PORT];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)PlayConnect4:(id)sender {
    int gameInstanceID = 96;
    
    // send http request to server to get an opponent to play against
    // set isGameCreatedSuccessfully to True if successful
    //isGameCreatedSuccessfully = true;
    
    if (isGameCreatedSuccessfully) {
        [gameSocket sendEvent:@"userSetup" withData:[NSNumber numberWithInt:gameInstanceID]];
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
