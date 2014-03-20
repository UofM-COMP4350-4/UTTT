var assert = require("assert");
var connect4GamePieceJS = require("../../../models/connect4/Connect4GamePiece.js");
var playerJS = require("../../../models/Player.js");

/*  Connect4 Game Piece Tests
 *  Use: Test class to be used with Mocha.  Tests the Connect4GamePiece.js functions.
 */

describe('Controller Test Suite', function(){
	describe('Connect4GamePiece Test Class', function() {
		it('Test: Inivialize Valid Data', function() {
			var connect4GamePiece = new connect4GamePieceJS.Connect4GamePiece( {
				player: new playerJS.Player(12,'Player 1'), pieceID: 1234
			});
			
			assert.equal(connect4GamePiece.player.id, 12);
			assert.equal(connect4GamePiece.player.name, 'Player 1');
			assert.equal(connect4GamePiece.pieceID, 1234);
		});
		
		it('Test: Initialize Invalid/Null/Undefined/NaN Data', function() {
			assert.throws(function() { 
				new connect4GamePieceJS.Connect4GamePiece( {
					player: new playerJS.Player(12,undefined), pieceID: 3
				}); 
			}, Error);
			
			assert.throws(function() { 
				new connect4GamePieceJS.Connect4GamePiece( {
					player: new playerJS.Player(), pieceID: 3
				}); 
			}, Error);
			
			assert.throws(function() { 
				new connect4GamePieceJS.Connect4GamePiece( {
					player: new playerJS.Player(undefined,'Player 1'), pieceID: 0
				}); 
			}, Error);
			
			assert.throws(function() { 
				new connect4GamePieceJS.Connect4GamePiece( {
					player: new playerJS.Player(12,null), pieceID: 1
				}); 
			}, Error);
			
			assert.throws(function() { 
				new connect4GamePieceJS.Connect4GamePiece( {
					player: new playerJS.Player(12,'Player 1'), pieceID: NaN
				}); 
			}, Error);
			
			assert.throws(function() { 
				new connect4GamePieceJS.Connect4GamePiece( {
					player: new playerJS.Player(NaN,'Player 1'), pieceID: 2
				}); 
			}, Error);
		});
	});
});
