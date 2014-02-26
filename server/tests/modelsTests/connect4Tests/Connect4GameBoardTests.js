var assert = require("assert");
var connect4GameBoardJS = require("../../../models/connect4/Connect4GameBoard.js");
var connect4GamePieceJS = require("../../../models/connect4/Connect4GamePiece.js");
var playerJS = require("../../../models/Player.js");

describe('Model Test Suite', function() {
	describe('Connect4 Game Board Tests Class', function() {
		it ('Test: Initialize, Valid Data', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			assert.equal(Game.gameID, 07);
			assert.equal(Game.instanceID, 532744);
			assert.equal(Game.userToPlay.name, Player1.name);
			assert.equal(Game.userToPlay.id, Player1.id);
		});
		it ('Test: Initialize, Invalid Data', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 'ABCD',
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
				})
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:'532744',
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
				})
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 'ABCD',
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player1
				})
			}, Error);
		});
		it ('Test: Play Move on Board', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			//assert.doesNotThrow(function() {
			var move = new connect4GameBoardJS.Connect4Move(0,0, Player1);
				//}, Error);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
		});
		it ('Test: Get Location If Drop Piece', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
		});
		it ('Test: Is Draw', function() {
		});
		it ('Test: Is Winner', function() {
		});
		it ('Test: Is Winner NW to SE', function() {
		});
		it ('Test: Is Winner NE to SW', function() {
		});
		it ('Test: Is Winner W to E', function() {
		});
		it ('Test: Is Winner N to S', function() {
		});
		it ('Test: Add Player', function() {
		});
		it ('Test: Is Player Turn', function() {
		});
		it ('Test: Get Next Turn Player ID', function() {
		});
	});
});
