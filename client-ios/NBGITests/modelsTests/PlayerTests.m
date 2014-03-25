//
//  PlayerTests.m
//  NBGI
//
//  Created by Cameron McKay on 3/12/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "Player.h"

@interface PlayerTests : XCTestCase

@end

@implementation PlayerTests

- (void)setUp
{
    [super setUp];
}

- (void)tearDown
{
    [super tearDown];
}

- (void)testValidData {
    Player *player = [[Player alloc] initWithUserIDAndNameAndisOnlineAndAvatarURL:5 userName:@"Player 1" isOnline:true avatarURL:@"/avatar/5"];
    XCTAssertEqual([player.userID intValue], 5, "UserID should be equal to 5.");
    XCTAssertEqual(player.username, @"Player 1", "Player name should be Player 1");
    XCTAssertEqual(player.avatarURL, @"/avatar/5", "Avatar URL should be /avatar/5");
    XCTAssertTrue(player.isOnline, "IsOnline should be true");
}

@end
