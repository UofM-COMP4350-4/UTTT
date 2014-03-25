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
    Player* player = [[Player alloc] initWithUserIDAndNameAndisOnlineAndAvatarURL:5 userName:@"Player 1" isOnline:true avatarURL:@"avatar.jpg"];
    Move *move = [[Move alloc]initWithPositionAndUser:CGPointMake(1, 3) user: player];
    
    XCTAssertEqual([move.user.userID intValue], 5, "UserID should be 5");
    XCTAssertEqual(move.user.username, @"Player 1", "UserName should be Player 1");
    XCTAssertEqual(move.user.isOnline, true, "isOnline should be true");
    XCTAssertEqual(move.user.avatarURL, @"avatar.jpg", "Avatar URL should be avatar.jpg");
    XCTAssertEqual(move.position.x, (float)1, "Position X should be 1.");
    XCTAssertEqual(move.position.y, (float)3, "Position Y should be 3.");
}

@end
