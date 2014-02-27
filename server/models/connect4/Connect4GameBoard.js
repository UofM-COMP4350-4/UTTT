var GridIteratorJS = require(".././GridIterator.js");
var ValidateObjectController = require("../.././controllers/ValidateObjectController.js");
var Connect4GamePiece = require("./Connect4GamePiece.js");

var PIECES_TO_WIN = 4;

exports.Connect4Move = function(x, y, player)
{
	this.x = x;
	this.y = y;
	this.player = player;
};
exports.Connect4Move.prototype.GetPlayer = function()
{
	return this.player;
};

exports.Connect4GameBoard = function(gameInfo)
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
	this.isWinner = false;
	this.lastPieceID = 0;
	this.moves = [];
};

exports.Connect4GameBoard.prototype.IsDraw = function()
{
	return this.moves.length == this.grid.length;
};

exports.Connect4GameBoard.prototype.GetLocationIfDropGamePieceAtCol = function(col)
{
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
		
		if (moved) {
			iterator.StepRowBackward();
		}
		currentGamePiece = this.grid[iterator.GetIndex()];
		move = {x:iterator.column, y:iterator.row, player:currentGamePiece.player};	
	}
	
	return move;
};

exports.Connect4GameBoard.prototype.IsWinner = function(col, row)
{
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	var isWinner = this.IsWinnerSouthWestToNorthEast(this.grid, col, row, this.ROW_SIZE, this.COL_SIZE);
	
	if (!isWinner) {
		isWinner = this.IsWinnerSouthEastToNorthWest(this.grid, col, row, this.ROW_SIZE, this.COL_SIZE);
	}
	
	if (!isWinner) {
		isWinner = this.IsWinnerHorizontally(this.grid, col, row, this.ROW_SIZE, this.COL_SIZE);
	}
	
	if (!isWinner) {
		isWinner = this.IsWinnerVertically(this.grid, col, row, this.ROW_SIZE, this.COL_SIZE);
	}
	
	this.isWinner = isWinner;
	
	return isWinner;
};

exports.Connect4GameBoard.prototype.IsWinnerSouthWestToNorthEast = function(grid, col, row, ROW_SIZE, COL_SIZE)
{
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	var iterator = new GridIteratorJS.GridIterator(grid, Math.max(col-PIECES_TO_WIN,0), Math.min(row+PIECES_TO_WIN,ROW_SIZE-1), ROW_SIZE, COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	var countSameOwner = 0;
	
	if (!currentGamePiece) {
		return false;
	}
	
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	while (currentGamePiece != null && !isWinner) {
		iterator.StepDiagonalForward();
		currentGamePiece = grid[iterator.GetIndex()];
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner == PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
};

exports.Connect4GameBoard.prototype.IsWinnerSouthEastToNorthWest = function(grid, col, row, ROW_SIZE, COL_SIZE)
{
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	var iterator = new GridIteratorJS.GridIterator(grid, Math.min(PIECES_TO_WIN+col, COL_SIZE-1), Math.max(row-PIECES_TO_WIN,0), ROW_SIZE, COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	if (!currentGamePiece) {
		return false;
	}
	var countSameOwner = 0;
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	while (currentGamePiece != null && !isWinner) {
		iterator.StepDiagonalBackward();
		currentGamePiece = grid[iterator.GetIndex()];
		
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner == PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
};

exports.Connect4GameBoard.prototype.IsWinnerHorizontally = function(grid, col, row, ROW_SIZE, COL_SIZE) 
{
	ValidateObjectController.ValidateNumber(row);
	var iterator = new GridIteratorJS.GridIterator(this.grid, 0, row, this.ROW_SIZE, this.COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	var countSameOwner = 0;
	if (!currentGamePiece) {
		return false;
	}
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	while (currentGamePiece != null && !isWinner) {
		iterator.StepColumnForward();
		currentGamePiece = grid[iterator.GetIndex()];
		
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner == PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
	
	return isWinner;
};

exports.Connect4GameBoard.prototype.IsWinnerVertically = function(grid, col, row, ROW_SIZE, COL_SIZE) {
	ValidateObjectController.ValidateNumber(col);
	var iterator = new GridIteratorJS.GridIterator(grid, col, 0, this.ROW_SIZE, this.COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	var countSameOwner = 0;
	
	if (!currentGamePiece) {
		return false;
	}	
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	var moved = true;
	while (currentGamePiece != null && !isWinner && moved) {
		moved = iterator.StepRowForward();
		currentGamePiece = grid[iterator.GetIndex()];
		
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 0;
		}
		
		if (countSameOwner === PIECES_TO_WIN) {
			isWinner = previousOwnerID;
		}
	}
	
	return isWinner;
};

exports.Connect4GameBoard.prototype.AddPlayer = function(player)
{
	ValidateObjectController.ValidateObject(player);
	if (this.players.length < 2)
	{
		this.players.push(player);
	}
	else
	{
		throw new Error("Attempted to add more players than maximum allowed");
	}
};

exports.Connect4GameBoard.prototype.IsPlayersTurn = function(move)
{
	ValidateObjectController.ValidateObject(move);
	var playerID = move.player.id;
	
	if (this.userToPlay.id == playerID) {
		return true;
	}
	else {
		return false;
	}
};

exports.Connect4GameBoard.prototype.GetNextTurnsPlayer = function()
{
	ValidateObjectController.ValidateObject(this.userToPlay);
	var nextPlayer = null;
	var turnPlayer = this.userToPlay;
	
	for (var index = 0; index < this.players.length; index++) {
		if (turnPlayer != this.players[index]) {
			nextPlayer = this.players[index];
		}
	}
	
	return nextPlayer;
};

exports.Connect4GameBoard.prototype.PlayMoveOnBoard = function(move)
{
	if (this.isWinner) {
		return;
	}
	ValidateObjectController.ValidateObject(move);
	var lmove = this.GetLocationIfDropGamePieceAtCol(move.x);
	var y = 0;

	if (lmove && y < this.ROW_SIZE -1) {
		y = lmove.y+1;
		move.y = y;
	}
	var iterator = new GridIteratorJS.GridIterator(this.grid, move.x, move.y, this.ROW_SIZE, this.COL_SIZE);
	var connect4GamePiece = this.grid[iterator.GetIndex()];
	
	if (!connect4GamePiece) {
		this.grid[iterator.GetIndex()] = new Connect4GamePiece.Connect4GamePiece({
			player: move.player, 
			pieceID: this.lastPieceID
			});
		this.lastPieceID++;
		this.userToPlay = this.GetNextTurnsPlayer();
		this.moves.push(move);
		
		this.IsWinner(move.x, move.y);
	}
	else {
		throw new Error('A game piece already exists at this location.');
	}
};
