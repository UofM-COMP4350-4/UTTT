var assert = require("assert");
var ValidateObjectController = require("../../controllers/ValidateObjectController.js");

/*  Validate Object Controller Tests
 *  Use: Test class to be used with Mocha.  Tests the ValidateObjectController.js functions.
 */

describe('Controller Test Suite', function(){
	describe('ValidateObjectController Test Class', function() {
		it('Test: Valid Data', function() {
			assert.equal(ValidateObjectController.ValidateObject(1), true);
			assert.equal(ValidateObjectController.ValidateObject(1.432423), true);
			assert.equal(ValidateObjectController.ValidateObject([]), true);
			assert.equal(ValidateObjectController.ValidateObject('Hello, World!'), true);
			assert.equal(ValidateObjectController.ValidateObject({a:'hello',b:'blah'}), true);
			assert.equal(ValidateObjectController.ValidateObject({a:'hello',b:{c:1,d:1}}), true);
			
			assert.throws(function() { ValidateObjectController.ValidateObject(null) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObject(undefined) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObject({a:null}) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObject({a:undefined}) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObject({a:NaN}) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObject(NaN) }, Error);
			
			assert.throws(function() { ValidateObjectController.ValidateNumber(null) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateNumber(undefined) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateNumber(NaN) }, Error);
			assert.equal(ValidateObjectController.ValidateNumber(1), true);
			assert.equal(ValidateObjectController.ValidateNumber(2.343), true);
			
			assert.throws(function() { ValidateObjectController.ValidateBoolean(null) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateBoolean(undefined) }, Error);
			assert.equal(ValidateObjectController.ValidateBoolean(true), true);
			assert.equal(ValidateObjectController.ValidateBoolean(false), true);
			
			assert.throws(function() { ValidateObjectController.ValidateString(null) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateString(undefined) }, Error);
			assert.equal(ValidateObjectController.ValidateString('hello, world!'), true);
			assert.equal(ValidateObjectController.ValidateString(''), true);

			assert.equal(ValidateObjectController.ValidateObjectIsOneDimensionalArray([]), true);
			assert.equal(ValidateObjectController.ValidateObjectIsOneDimensionalArray([1,2,3,4]), true);
			assert.equal(ValidateObjectController.ValidateObjectIsOneDimensionalArray(['a','b','c','d']), true);
			
			assert.throws(function() { ValidateObjectController.ValidateObjectIsOneDimensionalArray([[]]) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObjectIsOneDimensionalArray([[1,2],[3,4]]) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObjectIsOneDimensionalArray([['a'],['b'],['c','d']]) }, Error);
		});
		
		it('Test: Invalid Data', function() {
			assert.throws(function() { ValidateObjectController.ValidateObjectIsOneDimensionalArray(1) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObjectIsOneDimensionalArray('Not an Array') }, Error);
 			
			assert.throws(function() { ValidateObjectController.ValidateBoolean('hello,world') }, Error);
			assert.throws(function() { ValidateObjectController.ValidateBoolean(1) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateBoolean([]) }, Error);
			
			assert.throws(function() { ValidateObjectController.ValidateString(true) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateString(1) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateString([]) }, Error);
			
			assert.throws(function() { ValidateObjectController.ValidateNumber(true) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateNumber('1234') }, Error);
			assert.throws(function() { ValidateObjectController.ValidateNumber([]) }, Error);
		});
		
		it('Test: NaN/Null/Undefined Data', function() {
			assert.throws(function() { ValidateObjectController.ValidateObjectIsOneDimensionalArray(null) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateObjectIsOneDimensionalArray(undefined) }, Error);
			
			assert.throws(function() { ValidateObjectController.ValidateString(NaN) }, Error);
			assert.throws(function() { ValidateObjectController.ValidateBoolean(NaN) }, Error);
		});
		
		it('Test: Empty Data', function() {
			assert.equal(ValidateObjectController.ValidateObject({}), true);
			assert.equal(ValidateObjectController.ValidateString(''), true);
			assert.equal(ValidateObjectController.ValidateObject([]), true);
		});
	});
});