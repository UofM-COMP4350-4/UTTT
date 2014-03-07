var connect4GameBoard = require("../models/connect4/Connect4GameBoard.js");

exports.Connect4GameController = function(gameInfo) {
	this.gameBoard = new connect4GameBoard.Connect4GameBoard(gameInfo);
};

exports.Connect4GameController.prototype.CreateGame = function() {
	
};

exports.Connect4GameController.prototype.CompleteGame = function() {
	
};

exports.Connect4GameController.prototype.RequestMove = function(move) {	
	// 2. get proper placement of move based on the column
	var updatedConnect4Move = this.gameBoard.GetLocationIfDropGamePieceAtCol(move.col);
	
	if (this.gameBoard.IsPlayersTurn(move)) {
		if (updatedConnect4Move != null) {
			// 3. Place the move on the game board
			this.gameBoard.PlayMoveOnBoard(move.row, move.col);
			// 4. Check for a winner
			var isGameWon = this.gameBoard.IsWinner();
			
			if (isGameWon) {
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
