//
//  Move.m
//  NBGI
//
//  Created by Cameron McKay on 2/27/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import "Move.h"

@implementation Move

- (Move *) initWithPositionAndUserID:(CGPoint)position userID:(int)userID {
    self = [super init];
    
    if (self) {
        [self setUserID:[NSNumber numberWithInt:userID]];
        [self setPosition:position];
    }
    
    return self;
};

- (NSString *) CreateJSONString {
    NSError *writeError = nil;
    NSString *jsonString = nil;
    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:self.userID,@"userID",
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

@end
