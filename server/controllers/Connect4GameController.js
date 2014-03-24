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
	console.log("Call received from game management for move: " + move.x + " " + move.y);
	if (!err) {	
		if (this.gameBoard.winner) {
			console.log('Connect4GameController win event emitted.');
			this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Winner'));
		} else if (this.gameBoard.IsDraw()) {
			console.log('Connect4GameController draw event emitted.');
			this.emit('playResult',this.gameBoard.CreateBoardGameJSONObject('Draw'));
		} else {
			console.log('Connect4GameController Game board changed event emitted');
			this.emit('boardChanged', this.gameBoard.CreateBoardGameJSONObject('Board Updated'));
		}
	} else {
		console.log('Conncet4GameController: Move Failure event emitted');
		this.emit('moveFailure', this.gameBoard.CreateBoardGameJSONObject(err));
	}
};
