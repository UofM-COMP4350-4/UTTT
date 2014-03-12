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

- (void)testValidData {
    Move *move = [[Move alloc]initWithPositionAndUserID:CGPointMake(1, 3) userID:5];
    
    XCTAssertEqual([move.userID intValue], 5, "UserID should be 5");
    XCTAssertEqual(move.position.x, (float)1, "Position X should be 1.");
    XCTAssertEqual(move.position.y, (float)3, "Position Y should be 3.");
}

@end
