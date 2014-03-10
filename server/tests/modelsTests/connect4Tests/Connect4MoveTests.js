var assert = require("assert");
var connect4MoveJS = require("../../../models/connect4/Connect4Move.js");
var playerJS = require("../../../models/Player.js");

/*  Grid Validation Controller Tests
 *  Use: Test class to be used with Mocha.  Tests the GridValidationController.js functions.
 */

describe('Connect4 Test Suite', function(){
	describe('Connect4 Move Test Class', function() {
		it('Test: Initialize Valid Data', function() {
			var player1 = new playerJS.Player(1,'Player 1');
			var connect4Move = new connect4MoveJS.Connect4Move(2,3,player1);
			assert.equal(connect4Move.x, 2);
			assert.equal(connect4Move.y, 3);
			assert.equal(connect4Move.player, player1);
		});
		
		it('Test: Initialize Null/NaN/Undefined Data', function() {
			assert.throws(function() { new connect4MoveJS.Connect4Move(null, null, null) }, Error);
			assert.throws(function() { new connect4MoveJS.Connect4Move(undefined, undefined, undefined) }, Error);
			assert.throws(function() { new connect4MoveJS.Connect4Move(NaN, NaN, NaN) }, Error);
		});
		
		it('Test: Initialize Invalid Data', function() {
			assert.throws(function() { new connect4MoveJS.Connect4Move('not an int','not an int',1) }, Error);
			assert.throws(function() { new connect4MoveJS.Connect4Move(false,false,new playerJS.Player(1,'Player 1')) }, Error);
			assert.throws(function() { new connect4MoveJS.Connect4Move(1,2,false) }, Error);
		});
	});
});