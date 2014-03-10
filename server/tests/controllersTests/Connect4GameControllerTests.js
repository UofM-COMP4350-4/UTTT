var assert = require("assert");
var connect4GameControllerJS = require("../../controllers/Connect4GameController.js");
var connect4GameBoardJS = require("../../models/connect4/Connect4GameBoard.js");
var playerJS = require("../../models/Player.js");

describe('Controller Test Suite', function(){
	describe('GridValidationController Test Class', function() {
		it('Test: Initialize Valid Data', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			var connect4GameController = new connect4GameControllerJS.Connect4GameController(Game);
			assert.deepEqual(connect4GameController.gameBoard, Game);
			connect4GameController = new connect4GameControllerJS.Connect4GameController(Game);
			assert.deepEqual(connect4GameController.gameBoard, Game);
		});
		
		it('Test: Initialize Null/NaN/Undefined Data', function() {
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(null) }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(NaN) }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(undefined) }, Error);
		});
		
		it('Test: Initialize Invalid Data', function() {
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController('hello') }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(True) }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(False) }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(9000) }, Error);
		});
	});
});