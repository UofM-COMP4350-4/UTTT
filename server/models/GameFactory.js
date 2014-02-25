var ValidateObjectController = require("../controllers/ValidateObjectController.js");
var GridValidationController = require("../controllers/GridValidationController.js");
var Connect4GamePiece = require("./connect4/Connect4GamePiece");
var Connect4GameBoard = require("./connect4/Connect4GameBoard");

/*	Game Factory
 *  Use: Creates instances of GameBoards and GamePieces
 */

exports.GameFactory = function()
{
	
};

exports.GameFactory.prototype.GameTypeConstructor = Connect4GameBoard.Connect4GameBoard;  // default is Connect4
exports.GameFactory.prototype.GamePieceConstructor = Connect4GamePiece.Connect4GamePiece; // default is Connect4

exports.GameFactory.prototype.CreateGameBoard = function(gameInfo) {
	ValidateObjectController.Object(gameInfo);
	switch(gameInfo.gameID) {
		case 1: // create Connect4 GameBoard
			console.log('Created Connect4 GameBoard ID-' + gameInfo.gameID + '.');
			this.GameTypeConstructor = Connect4GameBoard.Connect4GameBoard;
			break;
	}

	return new this.GameTypeConstructor(gameInfo);
};

exports.GameFactory.prototype.CreateGamePiece = function(pieceInfo) {
	ValidateObjectController.Object(pieceInfo);
	switch(pieceInfo.gameID) {
		case 1: // create Connect4 GamePiece
			console.log('Created Connect4 GamePiece ID-' + pieceInfo.pieceID + '.');
			this.GamePieceConstructor = Connect4GamePiece.Connect4GamePiece;
			break;
	}
	
	return new this.GamePieceConstructor(pieceInfo);
};