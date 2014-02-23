var assert = require("assert");
var GridValidationController = require("../../controllers/GridValidationController.js");

/*  Grid Validation Controller Tests
 *  Use: Test class to be used with Mocha.  Tests the GridValidationController.js functions.
 */

describe('Controller Test Suite', function(){
	describe('GridValidationController Test Class', function() {
		it('Test: Valid Data', function() {
			assert.equal(GridValidationController.ValidateGridSize([1,2,3], 1, 3), true);
			assert.equal(GridValidationController.ValidateGridSize([1,2,3,4,5,6], 2, 3), true);
			assert.equal(GridValidationController.ValidateGridSize([1,2,3,4,5,6], 3, 2), true);
			
			assert.throws(function() { GridValidationController.ValidateGridSize([1,2,3,4,5,6], 8, 2) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([1,2,3,4,5,6], 2, 4) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([1,2,3,4,5,6], 8, 0) }, Error);
		});
		
		it('Test: Empty Grid', function() {
			assert.equal(GridValidationController.ValidateGridSize([], 0, 0), true);
			assert.throws(function() { GridValidationController.ValidateGridSize([], 1, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([], 0, 1) }, Error);
		});
		
		it('Test: Null/Undefined/NaN Data', function() {
			assert.throws(function() { GridValidationController.ValidateGridSize(null, 1, 2) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize(undefined, 2, 2) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([], NaN, 0) }, Error);
			// assert.throws(function() { GridValidationController.ValidateGridSize([1,2], 2, Nan) }, Error);
			// assert.throws(function() { GridValidationController.ValidateGridSize([1,2], null, 0) }, Error);
			// assert.throws(function() { GridValidationController.ValidateGridSize([1,2,3], undefined, 0) }, Error);
			// assert.throws(function() { GridValidationController.ValidateGridSize([], 1, undefined) }, Error);
			// assert.throws(function() { GridValidationController.ValidateGridSize([], 0, null) }, Error);
		});
	});
});