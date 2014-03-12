//
//  ValidationControllerTests.m
//  NBGI
//
//  Created by Cameron McKay on 3/12/2014.
//  Copyright (c) 2014 Christopher Catton. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "ValidationController.h"

@interface ValidationControllerTests : XCTestCase

@end

@implementation ValidationControllerTests

- (void)setUp
{
    [super setUp];
}

- (void)tearDown
{
    [super tearDown];
}

- (void)testValidData
{
    XCTAssertNoThrow([ValidationController ValidateObject:@"Hello, World!"], "Shouldn't throw exception");
    XCTAssertNoThrow([ValidationController ValidateObject:[NSDictionary dictionaryWithObject:@"Hello" forKey:@"World"]], "Shouldn't throw exception");
    XCTAssertNoThrow([ValidationController ValidateObject:[NSNumber numberWithInt:1000]], "Shouldn't throw exception");
    
    int x = 100;
    bool isBool = false;
    float floatingPoint = 1.1111;
    double dbl = 1.1;
    
    XCTAssertNoThrow([ValidationController ValidateValue:@"Hello, World!"], "Shouldn't throw exception");
    XCTAssertNoThrow([ValidationController ValidateValue:&x], "Shouldn't throw exception");
    XCTAssertNoThrow([ValidationController ValidateValue:&isBool], "Shouldn't throw exception");
    XCTAssertNoThrow([ValidationController ValidateValue:&floatingPoint], "Shouldn't throw exception");
    XCTAssertNoThrow([ValidationController ValidateValue:&dbl], "Shouldn't throw exception");
}

- (void)testInvalidData {
    XCTAssertThrows([ValidationController ValidateObject:NULL], "Should throw exception");
    XCTAssertThrows([ValidationController ValidateObject:nil], "Should throw exception");
    XCTAssertThrows([ValidationController ValidateObject:Nil], "blah;");
    
    XCTAssertThrows([ValidationController ValidateValue:NULL], "Should throw exception");
    XCTAssertThrows([ValidationController ValidateValue:nil], "Should throw exception");
    XCTAssertThrows([ValidationController ValidateValue:Nil], "blah;");
}

@end
