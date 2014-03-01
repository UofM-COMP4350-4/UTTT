var assert = require("assert");
var connect4GameBoardJS = require("../../../models/connect4/Connect4GameBoard.js");
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
			move = new connect4GameBoardJS.Connect4Move(0,2, Player2);
			/*assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,3, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,4, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,5, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);
			move = new connect4GameBoardJS.Connect4Move(0,6, Player2);
			assert.throws(function () { Game.PlayMoveOnBoard(move)}, Error, 'Row must be less than ' + Game.ROW_SIZE);*/
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
			assert.notEqual(Game.isWinner, true);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:3,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.notEqual(Game.isWinner, true);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:4,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.notEqual(Game.isWinner, true);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:0,y:5,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(Game.isWinner, true);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:2,y:0,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(Game.isWinner, true);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:5,y:0,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(5);
			assert.notEqual(Game.isWinner, true);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:6,y:0,player:Player1};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(6);
			assert.notEqual(Game.isWinner, true);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = {x:6,y:2,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(6);
			assert.notEqual(Game.isWinner, true);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, 1);
			
			move = {x:6,y:5,player:Player2};//new connect4GameBoardJS.Connect4Move(0,0, Player1); //valid
			Game.PlayMoveOnBoard(move);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(6);
			assert.notEqual(Game.isWinner, true);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, 2);
		});
		it ('Test: Is Draw', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			var move = {x:0,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:1,y:0,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:0,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:4,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:5,y:0,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:6,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:1,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:1,y:1,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:1,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:1,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:4,y:1,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:5,y:1,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:6,y:1,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:2,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:1,y:2,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:2,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:2,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:4,y:2,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:5,y:2,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:6,y:2,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:3,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:1,y:3,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:3,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:3,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:4,y:3,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:5,y:3,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:6,y:3,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:4,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:1,y:4,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:4,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:4,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:4,y:4,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:5,y:4,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:6,y:4,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:5,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:1,y:5,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:5,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:5,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:4,y:5,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:5,y:5,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:6,y:5,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			//assert.equal(Game.IsDraw(), true);
		});
		it ('Test: Is Winner SE to NW', function() {
			var Player1 = new playerJS.Player(13, 'Player 1');
			var Player2 = new playerJS.Player(402, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			move = {x:0,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);

			move = {x:0,y:1,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:2,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:3,player:Player2};
			Game.PlayMoveOnBoard(move);

			move = {x:1,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);

			move = {x:1,y:1,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:1,y:2,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:0,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:1,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:0,player:Player2};
			Game.PlayMoveOnBoard(move);

			//o
			//xo
			//oxo
			//xxxo
			
			assert.equal(Game.isWinner, true);
			assert.equal(Game.winner, Player2);
		});
		it ('Test: Is Winner SW to NE', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			var move = {x:3,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:1,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:2,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:3,player:Player2};
			Game.PlayMoveOnBoard(move);
			assert.notEqual(Game.isWinner, true);
			//___o
			//___x
			//___o
			//___x
			//0123
			
			move = {x:1,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:0,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			assert.notEqual(Game.isWinner, true);
			//   o
			//   x
			//   o
			//oxxx
			
			move = {x:1,y:1,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			move = {x:2,y:1,player:Player1};
			Game.PlayMoveOnBoard(move);
			assert.notEqual(Game.isWinner, true);
			move = {x:2,y:2,player:Player2};
			Game.PlayMoveOnBoard(move);
			
			//   o
			//  ox
			// oxo
			//oxxx
			
			assert.equal(Game.isWinner, true);
			assert.equal(Game.winner, Player2);
		});
		it ('Test: Is Winner W to E', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			var move = {x:1,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);

			move = {x:2,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:3,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:4,y:0,player:Player1};
			Game.PlayMoveOnBoard(move);
						
			assert.equal(Game.isWinner, true);
			assert.equal(Game.winner, Player1);
		});
		it ('Test: Is Winner N to S', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			var move = {x:0,y:1,player:Player1};
			Game.PlayMoveOnBoard(move);
						
			move = {x:0,y:2,player:Player1};
			Game.PlayMoveOnBoard(move);

			move = {x:0,y:3,player:Player1};
			Game.PlayMoveOnBoard(move);
			
			move = {x:0,y:4,player:Player1};
			Game.PlayMoveOnBoard(move);
						
			assert.equal(Game.isWinner, true);
			assert.equal(Game.winner, Player1);
		});
		it ('Test: Add Player', function() {
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
		it ('Test: Is Player Turn', function() {
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
		it ('Test: Get Next Turn Player ID', function() {
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
	});
});
