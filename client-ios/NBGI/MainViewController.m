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

//typedef void (^success)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON);
//defining a type of success we can reuse
typedef void (^success)(NSString *responseData);

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    success responseSuccess;
    
    //callback method defined
    responseSuccess = ^(NSString *data){
        NSLog(@"I get here: Handle Server response called");
        NSLog(@"the data returned is: %@", data);
    };
    
    [self sendHttpGetRequest: responseSuccess url: @"initialize"];
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

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)PlayConnect4:(id)sender {
    
}
@end
