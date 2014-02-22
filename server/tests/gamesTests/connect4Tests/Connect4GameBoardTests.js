var assert = require("assert");
var iteratorJS = require("../../.././games/connect4/Iterator.js");

describe('Connect4 Test Suite', function(){
	describe('Iterator Test Class', function() {
		it('Test: Initialize Valid Data', function() {
			var grid = [];
			for (var i = 0; i < 42; i++) {
				grid.push(i);
			}
			
			var iterator = new iteratorJS.Iterator(grid, 1, 2);
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
			
		})
		
		it('Test: Null / Undefined Parameters', function() {

		});
	});
});
