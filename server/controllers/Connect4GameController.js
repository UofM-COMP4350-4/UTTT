var connect4GameBoard = require("../models/connect4/Connect4GameBoard.js");
var ValidateObjectController = require("./ValidateObjectController.js");

exports.Connect4GameController = function(gameInfo) {
	ValidateObjectController.ValidateObject(gameInfo);
	this.gameBoard = new connect4GameBoard.Connect4GameBoard(gameInfo);
};

exports.Connect4GameController.LoadGame(game) {
	ValidateObjectController.ValidateObject(game);
	this.gameBoard = new connect4GameBoard.Connect4GameBoard(game);
	return this.gameBoard;
}

exports.Connect4GameController.prototype.CreateGame = function() {
	
};

exports.Connect4GameController.prototype.CompleteGame = function() {
	
};

exports.Connect4GameController.prototype.RequestMove = function(move) {	
	ValidateObjectController.ValidateObject(move);
	var updatedConnect4Move = this.gameBoard.GetLocationIfDropGamePieceAtCol(move.col);
	
	if (this.gameBoard.IsPlayersTurn(move)) {
		if (updatedConnect4Move != null) {
			this.gameBoard.PlayMoveOnBoard(move.row, move.col);
			
			if (this.gameBoard.IsWinner()) {
				// send message to winner and opponent saying the game has been won
			}
			else if (this.gameBoard.IsDraw()) {
				// send message to both players saying the game is a draw
			}
			else {
				// send message to opponent with updated game board state
			}
		}
		else {
			// move is invalid because column is already full
			// send message to client saying that this is an invalid move
		}	
	}
	else {
		// move is invalid because it was made out of turn
	}
};
