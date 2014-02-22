var assert = require("assert");
var iterator = require("../../.././games/connect4/Iterator.js");

describe('Connect4TestSuite', function(){
	describe('Iterator Test Class', function() {
		it('Test: Initialize Valid Data', function() {
			grid = [1,2,3,4,5,6,7,8,9,10,11,12];
			var iter = new iterator.Iterator(grid, 3, 3, 0, 0);
			assert.equal(iter.GetIndex(),0);
		})
	})
})
