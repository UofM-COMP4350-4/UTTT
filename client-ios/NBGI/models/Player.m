//
//  Player.m
//  NBGI
//
//  Created by Cameron McKay on 3/11/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Player.h"

@implementation Player

- (Player *) initWithUserIDAndNameAndisOnlineAndAvatarURL: (int) userID userName: (NSString *) userName isOnline: (bool) isOnline avatarURL : (NSString *) avatarURL {
    [ValidationController ValidateObject:userName];
    [ValidationController ValidateObject:avatarURL];
    self = [super init];
    
    if (self) {
        [self setUserID:[NSNumber numberWithInt:userID]];
        [self setUsername:userName];
        [self setIsOnline:isOnline];
        [self setAvatarURL:avatarURL];
    }
    
    return self;
}

- (NSString *) CreateJSONString {
    NSError *writeError = nil;
    NSString *jsonString = nil;
    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:self.userID,@"userID",self.avatarURL,@"avatarURL",
                                [NSNumber numberWithBool:self.isOnline],@"isOnline",self.username,@"userName",nil];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:&writeError];
    
    if (writeError != nil) {
        NSLog(@" error => %@ ", writeError);
    }
    else {
        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    
    return jsonString;
};

- (Player *) initWithJSONString:(NSString *) jsonString {
    [ValidationController ValidateObject:jsonString];
    Player *player;
    NSData *playerJSONData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = NULL;
    
    NSDictionary *jsonNSDict = [NSJSONSerialization JSONObjectWithData:playerJSONData options:NSJSONReadingMutableContainers error:&error];
    
    if (error == NULL) {
        if ([jsonNSDict objectForKey:@"userID"] != nil && [jsonNSDict objectForKey:@"userName"] != nil &&
            [jsonNSDict objectForKey:@"isOnline"] != nil && [jsonNSDict objectForKey:@"avatarURL"] != nil) {
            
            int userID = [[jsonNSDict objectForKey:@"userID"] intValue];
            bool isOnline = [[jsonNSDict objectForKey:@"isOnline"] boolValue];
            NSString *avatarURL = [jsonNSDict objectForKey:@"avatarURL"];
            NSString *userName = [jsonNSDict objectForKey:@"userName"];
            [ValidationController ValidateValue:&userID];
            [ValidationController ValidateValue:&isOnline];
            [ValidationController ValidateObject:avatarURL];
            [ValidationController ValidateObject:userName];
            
            player = [self initWithUserIDAndNameAndisOnlineAndAvatarURL:userID userName:userName isOnline:isOnline avatarURL:avatarURL];
        }
        else {
            [NSException raise:@"Missing Data" format:@"JSON String is missing data for instantiating this object."];
        }
    }
    else {
        NSLog(@" error => %@ ", error);
    }
    
    return player;
};

@end
