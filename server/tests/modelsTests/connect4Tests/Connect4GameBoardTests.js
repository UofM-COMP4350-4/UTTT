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
				});
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:'532744',
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
				});
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 'ABCD',
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player1
				});
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
			
			
			var move = new connect4GameBoardJS.Connect4Move(7,0, Player1);
			assert.throws(function () { Game.PlayMoveOnBoard(move)}, Error, 'Column must be less than ' + Game.COL_SIZE);
			move = new connect4GameBoardJS.Connect4Move(-1,0, Player1);
			assert.throws(function () { Game.PlayMoveOnBoard(move)}, Error, 'Column must be equal to or greater than 0');
			
			//will never throw
			//move = new connect4GameBoardJS.Connect4Move(0,-1, Player1);
			//assert.throws(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be equal to or greater than 0');
			
			move = new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			move = new connect4GameBoardJS.Connect4Move(5,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			move = new connect4GameBoardJS.Connect4Move(2,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			move = new connect4GameBoardJS.Connect4Move(0,1, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			move = new connect4GameBoardJS.Connect4Move(6,1, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			move = new connect4GameBoardJS.Connect4Move(6,5, Player1); //pos(7) in row, pos(6) in col
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			move = new connect4GameBoardJS.Connect4Move(0,2, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,3, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,4, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,5, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,6, Player1);
			assert.throws(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
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
			
			var move = {x:0,y:0,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			
			var dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:1,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:2,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:3,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:4,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:5,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:2,y:0,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:5,y:0,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(5);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:6,y:0,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(6);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:6,y:2,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(6);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, 1);
			
			move = {x:6,y:5,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(6);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, 2);
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
