var assert = require("assert");
var playerJS = require("../../models/Player.js");

/*  Grid Validation Controller Tests
 *  Use: Test class to be used with Mocha.  Tests the GridValidationController.js functions.
 */

describe('Controller Test Suite', function(){
	describe('GridValidationController Test Class', function() {
		it('Test: Initialize Valid Data', function() {
			var player = new playerJS.Player(12345,'Player 1');
			assert.equal(player.id, 12345);
			assert.equal(player.name, 'Player 1');
		});
		
		it('Test: Initialize Null/NaN/Undefined Data', function() {
			assert.throws(function() { new playerJS.Player(null,null) }, Error);
			assert.throws(function() { new playerJS.Player(undefined,undefined) }, Error);
			assert.throws(function() { new playerJS.Player(NaN,NaN) }, Error);
		});
		
		it('Test: Initialize Invalid Data', function() {
			assert.throws(function() { new playerJS.Player('not an int','Player 1') }, Error);
			assert.throws(function() { new playerJS.Player(false,'Player 1') }, Error);
			assert.throws(function() { new playerJS.Player(1,false) }, Error);
			assert.throws(function() { new playerJS.Player(1,1) }, Error);
		});
	});
});
