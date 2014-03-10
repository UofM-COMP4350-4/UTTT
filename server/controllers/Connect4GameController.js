var connect4GameBoard = require("../models/connect4/Connect4GameBoard.js");
var ValidateObjectController = require("./ValidateObjectController.js");
var events = require("events");

exports.Connect4GameController.__proto__ = events.EventEmitter.prototype; // inherit from EventEmitter

exports.Connect4GameController = function(gameInfo) {
	ValidateObjectController.ValidateObject(gameInfo);
	this.gameBoard = new connect4GameBoard.Connect4GameBoard(gameInfo);
	events.EventEmitter.call(this);
};

exports.Connect4GameController.LoadGame = function(game) {
	ValidateObjectController.ValidateObject(game);
	this.gameBoard = new connect4GameBoard.Connect4GameBoard(game);
	return this.gameBoard;
}

exports.Connect4GameController.prototype.RequestMove = function(move) {	
	ValidateObjectController.ValidateObject(move);
	var updatedConnect4Move = this.gameBoard.GetLocationIfDropGamePieceAtCol(move.col);
	
	if (this.gameBoard.IsPlayersTurn(move)) {
		if (updatedConnect4Move != null) {
			var error = this.gameBoard.PlayMoveOnBoard(move.row, move.col);
			
			if (this.gameBoard.IsWinner()) {
				this.emit('gameWon','winner');
			}
			else if (this.gameBoard.IsDraw()) {
				this.emit('gameDraw','draw');
			}
			else if (typeof error.err == 'undefined') {
				this.emit('boardChanged', this.gameBoard.CreateJSONObjectOnGameBoardChanged(undefined));
			}
			else {
				this.emit('invalidMove', error.err);
			}
		}
		else {
			this.emit('invalidMove','Invalid Move: Column is already full.');
		}	
	}
	else {
		this.emit('invalidMove','Invalide Move: It is not your turn.');
	}
};
