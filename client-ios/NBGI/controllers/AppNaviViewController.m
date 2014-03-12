//
//  AppNaviViewController.m
//  NBGI
//
//  Created by Christopher Catton on 2014-03-08.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "AppNaviViewController.h"

@interface AppNaviViewController ()

@end

@implementation AppNaviViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (BOOL)shouldAutorotate
{
    if ([self.topViewController isKindOfClass:[UINavigationController class]]) {
        UIViewController *rootController = [((UINavigationController *)self.topViewController).viewControllers objectAtIndex:0];
        return [rootController shouldAutorotate];
    }
    return [self.visibleViewController shouldAutorotate];
}
- (NSUInteger)supportedInterfaceOrientations {
    /*if ([self.topViewController isKindOfClass:[UINavigationController class]]) {
        UIViewController *rootController = [((UINavigationController *)self.topViewController).viewControllers objectAtIndex:0];
        return [rootController supportedInterfaceOrientations];
    }*/
    return [self.visibleViewController supportedInterfaceOrientations];
}
- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
