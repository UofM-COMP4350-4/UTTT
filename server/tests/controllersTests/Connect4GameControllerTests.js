var assert = require("assert");
var connect4GameControllerJS = require("../../controllers/Connect4GameController.js");
var connect4GameBoardJS = require("../../models/connect4/Connect4GameBoard.js");
var connect4GamePieceJS = require("../../models/connect4/Connect4GamePiece.js");
var connect4MoveJS = require("../../models/connect4/Connect4Move.js");
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
		
		it('Test: Request Null/NaN/Undefined move', function() {
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
			
			assert.throws(function() { new connect4GameController.RequestMove(null) }, Error);
			assert.throws(function() { new connect4GameController.RequestMove(NaN) }, Error);
			assert.throws(function() { new connect4GameController.RequestMove(undefined) }, Error);
		});		
		
		it('Test: Initialize Invalid Data', function() {
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController('hello') }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(True) }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(False) }, Error);
			assert.throws(function() { new connect4GameControllerJS.Connect4GameController(9000) }, Error);
		});
		
		it('Test: Emit Event on Draw', function() {
			var player1 = new playerJS.Player(12, 'Player 1');
			var player2 = new playerJS.Player(401, 'Player 2');
			var connect4PiecePlayer1 = new connect4GamePieceJS.Connect4GamePiece({player:player1, pieceID:1});
			var connect4PiecePlayer2 = new connect4GamePieceJS.Connect4GamePiece({player:player2, pieceID:2});
			var Game = new connect4GameBoardJS.Connect4GameBoard( {
				gameID: 1234,
				instanceID:532744,
				userToPlay:player2,
				players:[player1, player2],
				grid:[connect4PiecePlayer1, connect4PiecePlayer1, connect4PiecePlayer1, connect4PiecePlayer2,
					  connect4PiecePlayer1, connect4PiecePlayer1, connect4PiecePlayer1, connect4PiecePlayer2,
					  connect4PiecePlayer1, connect4PiecePlayer1, connect4PiecePlayer1, connect4PiecePlayer2,
					  connect4PiecePlayer2, connect4PiecePlayer2, connect4PiecePlayer2, connect4PiecePlayer1],
				moves:[new connect4MoveJS.Connect4Move(0,0,player1), new connect4MoveJS.Connect4Move(0,1,player1),
					   new connect4MoveJS.Connect4Move(0,2,player1), new connect4MoveJS.Connect4Move(0,3,player2),
					   new connect4MoveJS.Connect4Move(1,0,player1), new connect4MoveJS.Connect4Move(1,1,player1),
					   new connect4MoveJS.Connect4Move(1,2,player1), new connect4MoveJS.Connect4Move(1,3,player2),
					   new connect4MoveJS.Connect4Move(2,0,player1), new connect4MoveJS.Connect4Move(2,1,player1),
					   new connect4MoveJS.Connect4Move(2,2,player1), new connect4MoveJS.Connect4Move(2,3,player2),
					   new connect4MoveJS.Connect4Move(3,0,player1), new connect4MoveJS.Connect4Move(3,1,player1),
					   new connect4MoveJS.Connect4Move(3,2,player1), new connect4MoveJS.Connect4Move(3,3,player2)],
				isWinner:false,
				ROW_SIZE:4,
				COL_SIZE:4,
				maxPlayers:2,
				lastPieceID:1
			});
			
			var connect4GameController = new connect4GameControllerJS.Connect4GameController(Game);
			connect4GameController.on('playResult', function(data) {
				assert.equal(data.status,'Draw.');
			})
			connect4GameController.RequestMove(new connect4MoveJS.Connect4Move(0,0,player2));
		});
		
		it('Test: Emit Event on Winner', function() {

		});
		
		// it('Test: Emit Event on Board Changed (Move Played that doesnt result in winner / draw)', function() {
			// var player1 = new playerJS.Player(12, 'Player 1');
			// var Game = new connect4GameBoardJS.Connect4GameBoard({
				// gameID: 07,
				// instanceID: 532744,
				// userToPlay: player1,
				// player1: player1,
				// player2: new playerJS.Player(401, 'Player 2')
			// });
			// var connect4GameController = new connect4GameControllerJS.Connect4GameController(Game);
			// connect4GameController.on('boardChanged', function(data) {
				// assert.equal(data.status,undefined);
			// })
			// connect4GameController.RequestMove(new connect4MoveJS.Connect4Move(2,3,player1));
		// });
		
		// it('Test: Emit Event on not players turn to move', function() {
			// var player1 = new playerJS.Player(12, 'Player 1');
			// var player2 = new playerJS.Player(401, 'Player 2');
			// var Game = new connect4GameBoardJS.Connect4GameBoard({
				// gameID: 07,
				// instanceID: 532744,
				// userToPlay: player1,
				// player1: player1,
				// player2: player2
			// });
			// var connect4GameController = new connect4GameControllerJS.Connect4GameController(Game);
			// connect4GameController.on('moveFailure', function(data) {
				// assert.equal(data.status,'Invalide Move: It is not your turn.');
			// })
			// connect4GameController.RequestMove(new connect4MoveJS.Connect4Move(2,3,player2));
		// });
// 		
		// it('Test: Emit Event on player cannot move in that column', function() {
			// var player1 = new playerJS.Player(12, 'Player 1');
			// var player2 = new playerJS.Player(401, 'Player 2');
			// var connect4PiecePlayer1 = new connect4GamePieceJS.Connect4GamePiece({player:player1, pieceID:1});
			// var Game = new connect4GameBoardJS.Connect4GameBoard( {
				// gameID: 1234,
				// instanceID:532744,
				// userToPlay:player2,
				// players:[player1, player2],
				// grid:[connect4PiecePlayer1, connect4PiecePlayer1, null, null],
				// moves:[new connect4MoveJS.Connect4Move(0,0,player1),
					   // new connect4MoveJS.Connect4Move(0,1,player1)],
				// isWinner:false,
				// ROW_SIZE:2,
				// COL_SIZE:2,
				// maxPlayers:2,
				// lastPieceID:1
			// });
// 			
			// var connect4GameController = new connect4GameControllerJS.Connect4GameController(Game);
			// connect4GameController.on('moveFailure', function(data) {
				// assert.equal(data.status,'Invalid Move: Column is already full.');
			// })
			// connect4GameController.RequestMove(new connect4MoveJS.Connect4Move(0,0,player2));
		// });
	});
});