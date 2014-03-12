//
//  MoveTests.m
//  NBGI
//
//  Created by Cameron McKay on 3/12/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "Move.h"

@interface MoveTests : XCTestCase

@end

@implementation MoveTests

- (void)setUp {
    [super setUp];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testValidData { // objective-c doesn't allow passing of invalid data to this method since there are no objects.
    Move *move = [[Move alloc]initWithPositionAndUserID:CGPointMake(1, 3) userID:5];
    
    XCTAssertEqual([move.userID intValue], 5, "UserID should be 5");
    XCTAssertEqual(move.position.x, (float)1, "Position X should be 1.");
    XCTAssertEqual(move.position.y, (float)3, "Position Y should be 3.");
}

- (void)testCreateJSONString {
    Move *move = [[Move alloc]initWithPositionAndUserID:CGPointMake(1, 3) userID:5];
    NSString *jsonString = [move CreateJSONString];
    NSData *playerJSONData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = NULL;
    
    NSDictionary *jsonNSDict = [NSJSONSerialization JSONObjectWithData:playerJSONData options:NSJSONReadingMutableContainers error:&error];
    int userID = [[jsonNSDict objectForKey:@"userID"] intValue];
    int x = [[jsonNSDict objectForKey:@"x"] intValue];
    int y = [[jsonNSDict objectForKey:@"y"] intValue];

    XCTAssertEqual(userID, 5, "UserID should be 5.");
    XCTAssertEqual(x, 1, "X should be 1.");
    XCTAssertEqual(y, 3, "Y should be 3.");
}

@end
