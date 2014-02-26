var GridIteratorJS = require(".././GridIterator.js");
var ValidateObjectController = require("../.././controllers/ValidateObjectController.js")
var Connect4GamePiece = require("./Connect4GamePiece.js")

var PIECES_TO_WIN = 4;

exports.Connect4Move = function Connect4Move(x, y, player)
{
	this.x = x;
	this.y = y;
	this.player = player;
}
exports.Connect4Move.prototype.GetPlayer = function()
{
	return this.player;
}

exports.Connect4GameBoard = function Connect4GameBoard(gameInfo)
{
	ValidateObjectController.ValidateObject(gameInfo);
	ValidateObjectController.ValidateNumber(gameInfo.gameID);
	ValidateObjectController.ValidateNumber(gameInfo.instanceID);
	ValidateObjectController.ValidateObject(gameInfo.userToPlay);
	ValidateObjectController.ValidateObject(gameInfo.player1);
	ValidateObjectController.ValidateObject(gameInfo.player2);
	this.gameID = gameInfo.gameID;
	this.instanceID = gameInfo.instanceID;
	this.userToPlay = gameInfo.player1;
	this.ROW_SIZE = 6;
	this.COL_SIZE = 7;
	this.maxPlayers = 2;
	this.players = [gameInfo.player1, gameInfo.player2];
	this.grid = new Array(this.ROW_SIZE * this.COL_SIZE);
	this.IsWinner = false;
	this.lastPieceID = 0;
	this.moves = [];
}

exports.Connect4GameBoard.prototype.IsDraw = function() {
	return moves.length == grid.length;
}

exports.Connect4GameBoard.prototype.GetLocationIfDropGamePieceAtCol = function(col) {
	ValidateObjectController.ValidateNumber(col);
	var move = null;

	var iterator = new GridIteratorJS.GridIterator(this.grid, col, 0, this.ROW_SIZE, this.COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];
	var moved = true;
	if (currentGamePiece) {
		while (currentGamePiece && moved) {
			moved = iterator.StepRowForward();
			currentGamePiece = this.grid[iterator.GetIndex()];
		}
		
		if (moved)
			iterator.StepRowBackward();
		
		currentGamePiece = this.grid[iterator.GetIndex()];
		move = {x:iterator.column, y:iterator.row, player:currentGamePiece.player};	
	}
	
	return move;
}

exports.Connect4GameBoard.prototype.IsWinner = function(row, col) {
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	var isWinner = IsWinnerSouthWestToNorthEast(this.grid, row, col);
	
	if (!isWinner) {
		isWinner = IsWinnerSouthEastToNorthWest(this.grid, row, col);
	}
	
	if (!isWinner) {
		isWinner = IsWinnerHorizontally(row);
	}
	
	if (!isWinner) {
		isWinner = IsWinnerVertically(col);
	}
	
	this.IsWinner = isWinner;
	
	return isWinner;
}

function IsWinnerSouthWestToNorthEast(grid, row, col) {
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	var iterator = new GridIteratorJS.GridIterator(grid, col-Math.min(col,row), row-Math.min(col,row), ROW_SIZE, COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];	
	var countSameOwner = 0;
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	while (currentGamePiece != null && !isWinner) {
		iterator.StepDiagonalForward();
		currentGamePiece = this.grid[iterator.GetIndex()];
		
		if (previousOwnerID = currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner == exports.Connect4.PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
}

function IsWinnerSouthEastToNorthWest(grid, row, col) {
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	var iterator = new GridIteratorJS.GridIterator(grid, col+Math.min(col,row), row-Math.min(col,row), ROW_SIZE, COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];	
	var countSameOwner = 0;
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	while (currentGamePiece != null && !isWinner) {
		iterator.StepDiagonalBackward();
		currentGamePiece = this.grid[iterator.GetIndex()];
		
		if (previousOwnerID = currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner == exports.Connect4.PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
}

function IsWinnerHorizontally(row) {
	ValidateObjectController.ValidateNumber(row);
	var iterator = new GridIteratorJS.GridIterator(grid, 0, row, ROW_SIZE, COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];	
	var countSameOwner = 0;
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	while (currentGamePiece != null && !isWinner) {
		iterator.StepColumnForward();
		currentGamePiece = this.grid[iterator.GetIndex()];
		
		if (previousOwnerID = currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner == exports.Connect4.PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
	
	return isWinner;
}

function IsWinnerVertically(col) {
	ValidateObjectController.ValidateNumber(col);
	var iterator = new GridIteratorJS.GridIterator(grid, 0, row, ROW_SIZE, COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];	
	var countSameOwner = 0;
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	while (currentGamePiece != null && !isWinner) {
		iterator.StepRowForward();
		currentGamePiece = this.grid[iterator.GetIndex()];
		
		if (previousOwnerID = currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner == exports.Connect4.PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
	
	return isWinner;
}

exports.Connect4GameBoard.prototype.AddPlayer = function(player)
{
	ValidateObjectController.ValidateObject(player);
	if (this.players.length < 2)
	{
		this.players.push(Player);
	}
	else
	{
		throw new UserException("Attempted to add more players than maximum allowed");
	}
}

exports.Connect4GameBoard.prototype.IsPlayersTurn = function(Move) {
	ValidateObjectController.ValidateObject(move);
	var playerID = move.player.id;
	
	if (userToPlay.id == playerID) {
		return true;
	}
	else {
		return false;
	}
}

exports.Connect4GameBoard.prototype.GetNextTurnsPlayer = function() {
	ValidateObjectController.ValidateObject(this.userToPlay);
	var nextPlayer = null;
	var turnPlayer = this.userToPlay;
	
	for (var index = 0; index < this.players.length; index++) {
		if (turnPlayer != this.players[index]) {
			nextPlayer = this.players[index];
		}
	}
	
	return nextPlayer;
}

exports.Connect4GameBoard.prototype.PlayMoveOnBoard = function(move)
{
	ValidateObjectController.ValidateObject(move);
	var lmove = this.GetLocationIfDropGamePieceAtCol(move.x);
	var y = 0;

	if (lmove && y < this.ROW_SIZE -1)
		y = lmove.y+1;
	
	var iterator = new GridIteratorJS.GridIterator(this.grid, move.x, y, this.ROW_SIZE, this.COL_SIZE);
	var connect4GamePiece = this.grid[iterator.GetIndex()];
	
	if (!connect4GamePiece) {
		this.grid[iterator.GetIndex()] = new Connect4GamePiece.Connect4GamePiece({
			player: move.player, 
			pieceID: this.lastPieceID
			});
		this.lastPieceID++;
		this.userToPlay = this.GetNextTurnsPlayer();
		this.moves.push(move);
	}
	else {
		throw new Error('A game piece already exists at this location.');
	}
}
