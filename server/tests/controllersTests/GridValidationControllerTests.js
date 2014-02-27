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
			
			assert.equal(GridValidationController.ValidateColumnRowLocations(1, 2, 5, 2), true);
			assert.equal(GridValidationController.ValidateColumnRowLocations(4, 0, 2, 9), true);
		});
		
		it('Test: Empty Grid', function() {
			assert.equal(GridValidationController.ValidateGridSize([], 0, 0), true);
			assert.throws(function() { GridValidationController.ValidateGridSize([], 1, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([], 0, 1) }, Error);
		});
		
		it('Test: Grid Bounds', function() {
			assert.equal(GridValidationController.ValidateColumnRowLocations(0, 0, 1, 1), true);
			assert.equal(GridValidationController.ValidateColumnRowLocations(4, 2, 3, 5), true);
		});
		
		it('Test: Invalid Data', function() {
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(2, 0, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(2, 5, 0, 3) }, Error);
			
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations('str', false, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(2, 0, 0, 'str') }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(2, 0, 'str', 0) }, Error);
		});
		
		it('Test: Null/Undefined/NaN Data', function() {
			assert.throws(function() { GridValidationController.ValidateGridSize(null, 1, 2) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize(undefined, 2, 2) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([], NaN, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([1,2], 2, NaN) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([1,2], null, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([1,2,3], undefined, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([], 1, undefined) }, Error);
			assert.throws(function() { GridValidationController.ValidateGridSize([], 0, null) }, Error);
			
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(NaN, 0, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(null, 0, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(undefined, 0, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, NaN, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, null, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, undefined, 0, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, 0, NaN, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, 0, null, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, 0, undefined, 0) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, 0, 0, NaN) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, 0, 0, null) }, Error);
			assert.throws(function() { GridValidationController.ValidateColumnRowLocations(0, 0, 0, undefined) }, Error);
			
		});
	});
});