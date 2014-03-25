//
//  GameCompletedController.m
//  NBGI
//
//  Created by Cameron McKay on 2014-03-25.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "GameCompletedController.h"

@interface GameCompletedController ()

@property (weak, nonatomic) IBOutlet UILabel *OutputMessage;


@end

@implementation GameCompletedController

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
    
    if (_isWinner) {
        [_OutputMessage setText:@"You Win!"];
    }
    else {
        [_OutputMessage setText:@"You Lose!"];
    }
    
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)OnClickReturnToHome:(id)sender {
    [self performSegueWithIdentifier: @"ReturnToHomeSegue" sender: self];
}
@end
