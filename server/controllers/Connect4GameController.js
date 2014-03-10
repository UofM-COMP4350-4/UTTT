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
				this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Winner'));
			}
			else if (this.gameBoard.IsDraw()) {
				this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Draw'));
			}
			else if (typeof error.err == 'undefined') {
				this.emit('boardChanged', this.gameBoard.CreateBoardGameJSONObject(undefined));
			}
			else {
				this.emit('moveFailure', this.gameBoard.CreateBoardGameJSONObject(error.err));
			}
		}
		else {
			this.emit('moveFailure',this.gameBoard.CreateBoardGameJSONObject('Invalid Move: Column is already full.'));
		}	
	}
	else {
		this.emit('moveFailure',this.gameBoard.CreateBoardGameJSONObject('Invalide Move: It is not your turn.'));
	}
};
