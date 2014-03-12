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
    Player *player = [[Player alloc]initWithUserIDAndNameAndisOnlineAndAvatarURL:5 userName:@"Player 1" :true avatarURL:@"/avatar/5"];
    
    XCTAssertEqual([player.userID intValue], 5, "UserID should be equal to 5.");
    XCTAssertEqual(player.username, @"Player 1", "Player name should be Player 1");
    XCTAssertEqual(player.avatarURL, @"/avatar/5", "Avatar URL should be /avatar/5");
    XCTAssertTrue(player.isOnline, "IsOnline should be true");
}

- (void)testCreateJSONString {
    Player *player = [[Player alloc]initWithUserIDAndNameAndisOnlineAndAvatarURL:5 userName:@"Player 1" :true avatarURL:@"/avatar/5"];
    NSString *jsonString = [player CreateJSONString];
    NSData *playerJSONData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = NULL;
    
    NSDictionary *jsonNSDict = [NSJSONSerialization JSONObjectWithData:playerJSONData options:NSJSONReadingMutableContainers error:&error];
    int userID = [[jsonNSDict objectForKey:@"userID"] intValue];
    bool isOnline = [jsonNSDict objectForKey:@"isOnline"];
    NSString *avatarURL = [jsonNSDict objectForKey:@"avatarURL"];
    NSString *username = [jsonNSDict objectForKey:@"userName"];
    
    XCTAssertEqual(userID, 5, "UserID should be equal to 5.");
    XCTAssertTrue([username isEqualToString:@"Player 1"], "Player name should be Player 1");
    XCTAssertTrue([avatarURL isEqualToString:@"/avatar/5"], "Avatar URL should be /avatar/5");
    XCTAssertTrue(isOnline, "IsOnline should be true");
}

- (void)testParseValidJSONString {
    Player *player = [[Player alloc]initWithUserIDAndNameAndisOnlineAndAvatarURL:5 userName:@"Player 1" :true avatarURL:@"/avatar/5"];
    NSString *jsonString = [player CreateJSONString];
    Player *newPlayer = [player initWithJSONString:jsonString];
    XCTAssertEqual(player.userID, newPlayer.userID, "UserID should be equal to 5.");
    XCTAssertTrue([player.username isEqualToString:newPlayer.username], "Player name should be Player 1");
    XCTAssertTrue([player.avatarURL isEqualToString:newPlayer.avatarURL], "Avatar URL should be /avatar/5");
    XCTAssertEqual(player.isOnline, newPlayer.isOnline, "IsOnline should be true");
}

- (void)testParseJSONStringWithMissingElements {
    NSString *jsonString = @"{ \"userID\": 5, \"avatarURL\": \"5\" }";
    Player *player = [Player alloc];
    XCTAssertThrows([player initWithJSONString:jsonString], "Should throw an error");
    
    jsonString = @"{ \"userID\": 5, \"userName\": \"5\"  }";
    XCTAssertThrows([player initWithJSONString:jsonString], "Should throw an error");
    
    jsonString = @"{ \"isOnline\": false, \"userName\": \"5\" }";
    XCTAssertThrows([player initWithJSONString:jsonString], "Should throw an error");
    
    jsonString = @"{ \"isOnline\": false }";
    XCTAssertThrows([player initWithJSONString:jsonString], "Should throw an error");
    
    jsonString = @"{ }";
    XCTAssertThrows([player initWithJSONString:jsonString], "Should throw an error");
}

- (void)testParseJSONStringWithAdditionalElements {
    NSString *jsonString = @"{ \"userID\": 5, \"id\": 11, \"x\": 3, \"avatarURL\": \"/avatar/5\", \"userName\": \"Player 1\", \"isOnline\": true }";
    Player *player = [[Player alloc] initWithJSONString:jsonString];
    
    XCTAssertEqual([player.userID intValue], 5, "UserID should be equal to 5.");
    XCTAssertTrue([player.username isEqualToString:@"Player 1"], "Player name should be Player 1");
    XCTAssertTrue([player.avatarURL isEqualToString:@"/avatar/5"], "Avatar URL should be /avatar/5");
    XCTAssertTrue(player.isOnline, "IsOnline should be true");
}

- (void)testParseNilData {
    XCTAssertThrows([[Player alloc] initWithJSONString:nil], "Should throw an error");
    XCTAssertThrows([[Player alloc] initWithJSONString:Nil], "Should throw an error");
    XCTAssertThrows([[Player alloc] initWithJSONString:NULL], "Should throw an error");
}


@end
