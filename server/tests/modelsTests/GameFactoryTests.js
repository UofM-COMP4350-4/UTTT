var assert = require("assert");
var gameFactoryJS = require("../../models/GameFactory.js");
var playerJS = require("../../models/Player.js");

/*  Grid Validation Controller Tests
 *  Use: Test class to be used with Mocha.  Tests the GridValidationController.js functions.
 */

describe('Controller Test Suite', function(){
	describe('GridValidationController Test Class', function() {
		it('Test: Inivialize Valid Data', function() {
			var gameFactory = new gameFactoryJS.GameFactory();
			var player1 = new playerJS.Player(12,'Player 1');
			var player2 = new playerJS.Player(17,'Player 2');
			var connect4GameBoard = gameFactory.CreateGameBoard( { 
				gameID: 1, instanceID: 2, player1: player1, player2: player2,
				userToPlay: player1 
			});
			var connect4GamePiece = gameFactory.CreateGamePiece( {
				player: player1, pieceID: 1, gameTypeID: 1
			});
			
			assert.equal(connect4GameBoard.gameID, 1);
			assert.equal(connect4GameBoard.instanceID, 2);
			assert.equal(connect4GameBoard.players[0].id, 12);
			assert.equal(connect4GameBoard.players[0].name, 'Player 1');
			assert.equal(connect4GameBoard.players[1].id, 17);
			assert.equal(connect4GameBoard.players[1].name, 'Player 2');
			assert.equal(connect4GameBoard.userToPlay.id, 12);
			assert.equal(connect4GameBoard.userToPlay.name, 'Player 1');

			assert.equal(connect4GamePiece.player.id, 12);
			assert.equal(connect4GamePiece.player.name, 'Player 1');
			assert.equal(connect4GamePiece.pieceID, 1);
		});
		
		it('Test: Initialize Null/NaN/Undefined Data', function() {
			var gameFactory = new gameFactoryJS.GameFactory();
			
		 	assert.throws(function() { gameFactory.CreateGameBoard( null ) }, Error);
		 	assert.throws(function() { gameFactory.CreateGameBoard( NaN) }, Error);
		 	assert.throws(function() { gameFactory.CreateGameBoard( undefined ) }, Error);
		 	assert.throws(function() { gameFactory.CreateGamePiece( null) }, Error);
		 	assert.throws(function() { gameFactory.CreateGamePiece( NaN ) }, Error);
		 	assert.throws(function() { gameFactory.CreateGamePiece( undefined ) }, Error);
		});
	});
});