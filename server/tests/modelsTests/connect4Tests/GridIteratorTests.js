var assert = require("assert");
var GridIteratorJS = require("../../.././models/GridIterator.js");

/*  Grid Iterator Tests
 *  Use: Test class to be used with Mocha.  Tests the GridIterator.js data structure.
 */

function createGrid(size) {
	var grid = [];
	for (var i = 0; i < size; i++) {
		grid.push(i);
	}
	return grid;
}

function assertGridInformation(iterator, index, row, col) {
	assert.equal(iterator.GetIndex(), index);
	assert.equal(iterator.row, row);
	assert.equal(iterator.column, col);
}

describe('Connect4 Test Suite', function(){
	describe('Iterator Test Class', function() {
		it('Test: Initialize Valid Data', function() {
			var grid = createGrid(42);
			var iterator = new GridIteratorJS.GridIterator(grid, 1, 2, 6, 7);
			assert.equal(iterator.grid.length, grid.length);
			
			for (var i = 0; i < grid.length; i++) {
				assert.equal(iterator.grid[i],grid[i]);
			}
			
			assert.equal(iterator.row_size, 6);
			assert.equal(iterator.col_size, 7);
			assert.equal(iterator.column, 1);
			assert.equal(iterator.row, 2);
		});
		
		it('Test: Initialize Invalid Data', function() {
			var validGrid = createGrid(42);
			
			assert.throws(function() { new GridIteratorJS.GridIterator(validGrid, 8, 2, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(validGrid, 2, 8, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(validGrid, 8, 8, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(validGrid, 7, 2, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(validGrid, 8, 6, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator([], 0, 0, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator([[1,2],[3,4,8,9],[5,6]], 0, 0, 6, 7) }, Error);
			
			invalidGrid = createGrid(35);
			assert.throws(function() { new GridGridIteratorJS.GridIterator(invalidGrid, 0, 0, 6, 7) }, Error);
		})
		
		it('Test: Null / Undefined Parameters', function() {
			assert.throws(function() { new GridIteratorJS.GridIterator(null, 0, 0, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(undefined, 0, 0, 6, 7) }, Error);			
			assert.throws(function() { new GridIteratorJS.GridIterator([], null, 0, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator([], undefined, 0, 6, 7) }, Error);			
			assert.throws(function() { new GridIteratorJS.GridIterator([], 0, null, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator([], 0, undefined, 6, 7) }, Error);
			
			assert.throws(function() { new GridIteratorJS.GridIterator(null, null, 0, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(undefined, undefined, 0, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator([], null, null, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator([], undefined, undefined, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(null, 0, null, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(undefined, 0, undefined, 6, 7) }, Error);
			
			assert.throws(function() { new GridIteratorJS.GridIterator(null, null, null, 6, 7) }, Error);
			assert.throws(function() { new GridIteratorJS.GridIterator(undefined, undefined, undefined, 6, 7) }, Error);
			
			assert.throws(function() { new GridIteratorJS.Move(undefined, 0) }, Error);
			assert.throws(function() { new GridIteratorJS.Move(0, undefined) }, Error);
			assert.throws(function() { new GridIteratorJS.Move(null, 0) }, Error);
			assert.throws(function() { new GridIteratorJS.Move(0, null) }, Error);
			
			assert.throws(function() { new GridIteratorJS.StepToLocation(undefined, 0) }, Error);
			assert.throws(function() { new GridIteratorJS.StepToLocation(0, undefined) }, Error);
			assert.throws(function() { new GridIteratorJS.StepToLocation(null, 0) }, Error);
			assert.throws(function() { new GridIteratorJS.StepToLocation(0, null) }, Error);
		});
		
		it('Test: Valid Data When Moving Around', function() {
			var grid = createGrid(42);
			var iterator = new GridIteratorJS.GridIterator(grid, 0, 0, 6, 7);
			
			iterator.StepRowForward();
			assertGridInformation(iterator, 7, 1, 0);
			
			iterator.StepRowForward();
			assertGridInformation(iterator, 14, 2, 0);
	
			iterator.StepRowBackward();
			assertGridInformation(iterator, 7, 1, 0);
			
			iterator.StepColumnForward();
			assertGridInformation(iterator, 8, 1, 1);
			
			iterator.StepRowBackward();
			assertGridInformation(iterator, 1, 0 , 1);
			
			iterator.StepColumnForward();
			assertGridInformation(iterator, 2, 0 , 2);
			
			iterator.StepColumnForward();
			assertGridInformation(iterator, 3, 0, 3);
			
			iterator.StepColumnForward();
			assertGridInformation(iterator, 4, 0, 4);
			
			iterator.StepColumnBackward();
			assertGridInformation(iterator, 3, 0, 3);
			
			iterator.StepDiagonalForward();
			assertGridInformation(iterator, 11, 1, 4);
			
			iterator.StepDiagonalBackward();
			assertGridInformation(iterator, 3, 0, 3);
			
		});
		
		it('Test: Test Bounds When Moving Around', function() {
			var grid = createGrid(42);
			var iterator = new GridIteratorJS.GridIterator(grid, 0, 0, 6, 7);
			
			assert.equal(iterator.StepRowBackward(), null);
			assert.equal(iterator.StepColumnBackward(), null);
			assert.equal(iterator.StepDiagonalBackward(), null);
			
			iterator.StepToLocation(5,6);
			assert.equal(iterator.StepRowForward(), null);
			assert.equal(iterator.StepColumnForward(), null);
			assert.equal(iterator.StepDiagonalForward(), null);
		});
		
		it('Test: Invalid/Bound data when Moving Around', function() {
			var grid = createGrid(42);
			var iterator = new GridIteratorJS.GridIterator(grid, 1, 2, 6, 7);

			assert.throws(function() { new iterator.StepToLocation(8,8) }, Error);
			assert.throws(function() { new iterator.StepToLocation(-1,0) }, Error);
			assert.throws(function() { new iterator.StepToLocation(3,7) }, Error);
			assert.throws(function() { new iterator.StepToLocation(6,7) }, Error);
			assert.throws(function() { new iterator.StepToLocation(7,6) }, Error);
			assert.throws(function() { new iterator.StepToLocation(4,-3) }, Error);
		});
	});
});
