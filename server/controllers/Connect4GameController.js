var connect4GameBoard = require("../models/connect4/Connect4GameBoard.js");
var connect4Move = require("../models/connect4/Connect4Move.js");

exports.Connect4GameController = function Connect4GameController()
{
	
}

exports.Connect4GameController.CreateGame() {
	
}

exports.Connect4GameController.CompleteGame() {
	
}

exports.Connect4GameController.RequestMove(row, col, gameID) {
	// 1. read game from database using gameID to get Connect4GameBoard object
	// faked for now
	var gameBoard = new connect4GameBoard.Connect4GameBoard();
	
	// 2. get proper placement of move based on the column
	var updatedConnect4Move = gameBoard.GetLocationIfDropGamePieceAtCol(col);
	
	if (updatedConnect4Move != null) {
		// 3. Place the move on the game board
		gameBoard.PlayMoveOnBoard(row, col);
		// 4. Check for a winner
		var isGameWon = gameBoard.IsWinner();
		
		if (isGameWon) {
			// send message to winner and opponent saying the game has been won
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
