//
//  SearchingForOpponent.m
//  NBGI
//
//  Created by Cameron McKay on 2014-03-25.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "SearchingForOpponent.h"

@interface SearchingForOpponent ()

@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *SearchForOppSpinner;

@end

@implementation SearchingForOpponent



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
    
//    UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
//    [spinner setCenter:CGPointMake(100, 100)]; // I do this because I'm in landscape mode
    [_SearchForOppSpinner startAnimating];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

@end
