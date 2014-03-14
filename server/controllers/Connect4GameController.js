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
	var err = this.gameBoard.PlayMoveOnBoard(move);

	if (!err) {	
		if (this.gameBoard.winner) {
			this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Winner'));
		} else if (this.gameBoard.IsDraw()) {
			this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Draw'));
		} else {
			this.emit('boardChanged', this.gameBoard.CreateBoardGameJSONObject());
		}
	} else {
		this.emit('moveFailure', this.gameBoard.CreateBoardGameJSONObject(err));
	}
};
