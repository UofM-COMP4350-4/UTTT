var assert = require("assert");
var connect4GameBoardJS = require("../../../models/connect4/Connect4GameBoard.js");
var playerJS = require("../../../models/Player.js");
var connect4MoveJS = require("../../../models/connect4/Connect4Move.js");

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
			
			var existingGame = new connect4GameBoardJS.Connect4GameBoard(Game);
			assert.equal(existingGame.gameID, Game.gameID);
			assert.equal(existingGame.instanceID, Game.instanceID);
			assert.equal(existingGame.userToPlay, Game.userToPlay);
			assert.equal(existingGame.grid, Game.grid);
			assert.equal(existingGame.moves, Game.moves);
			assert.equal(existingGame.isWinner, Game.isWinner);
			assert.equal(existingGame.ROW_SIZE, Game.ROW_SIZE);
			assert.equal(existingGame.COL_SIZE, Game.COL_SIZE);
			assert.equal(existingGame.maxPlayers, Game.maxPlayers);
			assert.equal(existingGame.lastPieceID, Game.lastPieceID);
			
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
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 1234,
				instanceID:532744,
				userToPlay:Player1,
				players:null,
				grid:null,
				moves:null,
				isWinner:null,
				ROW_SIZE:null,
				COL_SIZE:null,
				maxPlayers:null,
				lastPieceID:null
				});
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 1234,
				instanceID:532744,
				userToPlay:Player1,
				players:undefined,
				grid:undefined,
				moves:undefined,
				isWinner:undefined,
				ROW_SIZE:undefined,
				COL_SIZE:undefined,
				maxPlayers:undefined,
				lastPieceID:undefined
				});
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 1234,
				instanceID:532744,
				userToPlay:Player1,
				players:NaN,
				grid:NaN,
				moves:NaN,
				isWinner:NaN,
				ROW_SIZE:NaN,
				COL_SIZE:NaN,
				maxPlayers:NaN,
				lastPieceID:NaN
				});
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 1234,
				instanceID:532744,
				userToPlay:Player1,
				players:[],
				grid:[],
				moves:[],
				isWinner:False,
				ROW_SIZE:5,
				COL_SIZE:2,
				maxPlayers:2,
				lastPieceID:3
				});
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 1234,
				instanceID:532744,
				userToPlay:Player1,
				players:[[Player1],[Player2]],
				grid:[[1,2],[2,3]],
				moves:[[1,2],[2,3]],
				isWinner:False,
				ROW_SIZE:5,
				COL_SIZE:2,
				maxPlayers:2,
				lastPieceID:3
				});
			}, Error);
			assert.throws(function() {new connect4GameBoardJS.Connect4GameBoard({
				gameID: 1234,
				instanceID:532744,
				userToPlay:Player1,
				players:[[Player1],[Player2]],
				grid:[[1,2],[2,3]],
				moves:[[1,2],[2,3]],
				isWinner:'o',
				ROW_SIZE:'l',
				COL_SIZE:'l',
				maxPlayers:'e',
				lastPieceID:'h'
				});
			}, Error);
		});
		it ('Test: Play Move Base Cases', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			var move;
			var dropLoc;
			
			move = new connect4MoveJS.Connect4Move(-1,0, Player1);
			assert.throws(function () { Game.PlayMoveOnBoard(move)}, Error, 'Error: Connect4Move() accepted -1 as Column');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.equal(dropLoc.player, null);
			
			move = new connect4MoveJS.Connect4Move(0,-1, Player1);
			//we correct for y, Connect4Move will try to insert into next available row and throw an error if it does not exist.
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.equal(dropLoc.player, null);
			
			move = new connect4MoveJS.Connect4Move(Game.COL_SIZE,0, Player1);
			assert.throws(function () { Game.PlayMoveOnBoard(move)}, Error, 'Error: Connect4Move() accepted' + Game.COL_SIZE + ' as Column');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.equal(dropLoc.player, null);
			
			move = new connect4MoveJS.Connect4Move(Game.ROW_SIZE,0, Player1);
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.equal(dropLoc.player, null);
			
			assert.equal(Game.isWinner, false);
		});
		it ('Test: Play Move on Board Horizontal, Linear, (0,0)-start, no win', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			var move;
			var dropLoc;
			
			move = new connect4MoveJS.Connect4Move(0,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(1,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(0,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			
			move = new connect4MoveJS.Connect4Move(1,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(Game.moves.length, 6);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			
			move = new connect4MoveJS.Connect4Move(2,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			move = new connect4MoveJS.Connect4Move(3,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			
			assert.equal(Game.isWinner, false);
		});
		it ('Test: Play Move on Board Horizontal, Linear, (0,0)-start, win', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			var move;
			var dropLoc;
			
			move = new connect4MoveJS.Connect4Move(0,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(0,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(0);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(1,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(1,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.notEqual(dropLoc.y, move.y); //game already won
			
			assert.equal(Game.isWinner, true);
		});
		it ('Test: Play Move on Board Horizontal, Linear, (1,0)-start, no-win', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			var move;
			var dropLoc;
			
			move = new connect4MoveJS.Connect4Move(1,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(4,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(4);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(1,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			
			move = new connect4MoveJS.Connect4Move(2,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			
			move = new connect4MoveJS.Connect4Move(3,0, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			
			move = new connect4MoveJS.Connect4Move(4,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(4);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y+1);
			
			assert.equal(Game.isWinner, false);
		});
		it ('Test: Play Move on Board Horizontal, Linear, (1,0)-start, win', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			var move;
			var dropLoc;
			
			move = new connect4MoveJS.Connect4Move(1,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(1,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(4,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(4);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(4,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(4);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.notEqual(dropLoc.y, move.y); //game already won
			
			assert.equal(Game.isWinner, true);
		});
		it ('Test: Play Move on Board Horizontal, Discontinous, (1,0)-start, no-win', function() {
			var Player1 = new playerJS.Player(12, 'Player 1');
			var Player2 = new playerJS.Player(401, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			var move;
			var dropLoc;
			
			move = new connect4MoveJS.Connect4Move(1,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(1,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(1);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(2,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(2);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,0, Player1);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(3,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(3);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(5,0, Player1); //valid
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(5);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			move = new connect4MoveJS.Connect4Move(5,1, Player2);
			assert.doesNotThrow(function () { Game.PlayMoveOnBoard(move)}, 'A game piece already exists at this location.');
			dropLoc = Game.GetLocationIfDropGamePieceAtCol(5);
			assert.notEqual(dropLoc, null);
			assert.equal(dropLoc.x, move.x);
			assert.equal(dropLoc.y, move.y);
			
			assert.equal(Game.isWinner, false);
		});
		it ('Test: Play Move on Board Vertical, Linear, (0,0)-start, win', function() {
		
		});
		it ('Test: Play Move on Board Vertical, Linear, (0,0)-start, no-win', function() {
		
		});
		it ('Test: Play Move on Board Vertical, Linear, (1,0)-start, no-win', function() {
		
		});
		it ('Test: Play Move on Board Vertical, Linear, (1,0)-start, win', function() {
		
		});
		it ('Test: Play Move on Board Vertical, Discontinous, (0,0)-start, win', function() {
		
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
			
			assert.equal(Game.isWinner, false);
			
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
		it ('Test: Is Winner SE to NW (0,3)-(3,0)', function() {
			var Player1 = new playerJS.Player(13, 'Player 1');
			var Player2 = new playerJS.Player(402, 'Player 2');
			var Game = new connect4GameBoardJS.Connect4GameBoard({
				gameID: 07,
				instanceID:532744,
				userToPlay:Player1,
				player1:Player1,
				player2:Player2
			});
			
			var move = {x:0,y:0,player:Player1};
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
		it ('Test: Is Winner SE to NW (4,1)-(1,4)', function() {
		});
		it ('Test: Is Winner SW to NE (3,3)-(0,0)', function() {
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
		it ('Test: Is Winner SW to NE (4,4)-(1,1)', function() {
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
