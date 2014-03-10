var connect4GameBoard = require("../models/connect4/Connect4GameBoard.js");
var ValidateObjectController = require("./ValidateObjectController.js");
var events = require("events");
var util = require("util");

exports.Connect4GameController = function(gameInfo) {
	ValidateObjectController.ValidateObject(gameInfo);
	this.gameBoard = new connect4GameBoard.Connect4GameBoard(gameInfo);
	events.EventEmitter.call(this);
};

util.inherits(exports.Connect4GameController, events.EventEmitter);

exports.Connect4GameController.prototype.RequestMove = function(move) {	
	ValidateObjectController.ValidateObject(move);
	var error = this.gameBoard.PlayMoveOnBoard(move);

	if (this.gameBoard.IsPlayersTurn(move)) {
		if (typeof error == 'undefined') {	
			if (this.gameBoard.winner != undefined) {
				this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Winner'));
			}
			else if (this.gameBoard.IsDraw()) {
				this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Draw'));
			}
			else if (typeof error.err == 'undefined') {
				this.emit('boardChanged', this.gameBoard.CreateBoardGameJSONObject(undefined));
			}
		}
		else {
			this.emit('moveFailure', this.gameBoard.CreateBoardGameJSONObject(error));
		}
	}
	else {
		this.emit('moveFailure', this.gameBoard.CreateBoardGameJSONObject(error));
	}
	
};
