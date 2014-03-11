//
//  MainViewController.m
//  NBGI
//
//  Created by Cameron McKay on 2/26/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "MainViewController.h"

@interface MainViewController ()

- (IBAction)PlayConnect4:(id)sender;

@end

@implementation MainViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        //[sendInitializeRequest];
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
    NSLog(@"I get here");
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)PlayConnect4:(id)sender {
    
}
@end
