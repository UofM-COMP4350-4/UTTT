//
//  Move.m
//  NBGI
//
//  Created by Cameron McKay on 2/27/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Move.h"

@implementation Move

- (Move *) initWithPositionAndUser:(CGPoint)position user: (Player *) user {
    self = [super init];
    
    if (self) {
        //[self setUserID:[NSNumber numberWithInt:userID]];
        [self setUser:user];
        [self setPosition:position];
    }
    
    return self;
};

- (NSString *) CreateJSONString {
    NSError *writeError = nil;
    NSString *jsonString = nil;
    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:self.user,@"user",
                                [NSNumber numberWithInt:self.position.x],@"x",
                                [NSNumber numberWithInt:self.position.y],@"y", nil];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:&writeError];
    
    if (writeError != nil) {
        NSLog(@" error => %@ ", writeError);
    }
    else {
        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    
    return jsonString;
};

- (Move *) initWithJSONString:(NSString *) jsonString {
    [ValidationController ValidateObject:jsonString];
    Move *move;
    NSData *playerJSONData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = NULL;
    
    NSDictionary *jsonNSDict = [NSJSONSerialization JSONObjectWithData:playerJSONData options:NSJSONReadingMutableContainers error:&error];
        
    if (error == NULL) {
        if ([jsonNSDict objectForKey:@"player"] != nil &&
            [jsonNSDict objectForKey:@"x"] != nil &&
            [jsonNSDict objectForKey:@"y"] != nil) {
            
            NSDictionary *user = [jsonNSDict objectForKey:@"player"];
            int userID = [[user objectForKey:@"id"] intValue];
            NSString * name = [user objectForKey:@"name"];
            Player *player = [[Player alloc] initWithUserIDAndNameAndisOnlineAndAvatarURL:[[user objectForKey:@"id"] intValue] userName:[user objectForKey:@"name"] isOnline:true avatarURL:@""];
            int x = [[jsonNSDict objectForKey:@"x"] intValue];
            int y = [[jsonNSDict objectForKey:@"y"] intValue];
            [ValidationController ValidateObject:player];
            [ValidationController ValidateValue:&x];
            [ValidationController ValidateValue:&y];
            
            move = [self initWithPositionAndUser:CGPointMake((float)x, (float)y) user:player];
        }
        else {
            [NSException raise:@"Missing Data" format:@"JSON String is missing data for instantiating this object."];
        }
    }
    else {
        NSLog(@" error => %@ ", error);
    }
    
    return move;
};

@end
