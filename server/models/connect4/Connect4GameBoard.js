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
	this.winner = null;
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
	var move = {x:-1, y:-1, player:null};

	var iterator = new GridIteratorJS.GridIterator(this.grid, col, 0, this.ROW_SIZE, this.COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];
	var moved = true;
	if (currentGamePiece) {
		while (currentGamePiece && moved) {
			moved = iterator.StepRowForward();
			currentGamePiece = this.grid[iterator.GetIndex()];
		}
		
		if (!currentGamePiece) {
			iterator.StepRowBackward();
		}
		currentGamePiece = this.grid[iterator.GetIndex()];
		if (col != iterator.column) {
			throw ("Error: col != iterator.column");
		}
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
	var iterator = new GridIteratorJS.GridIterator(grid, Math.max(col-(PIECES_TO_WIN-1),0), Math.max(row-(PIECES_TO_WIN-1),0), ROW_SIZE, COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	var countSameOwner = 1;
	
	var previousOwnerID = -1;
	var isWinner = false;
	var moved = true;
	while (!isWinner && moved) {
		currentGamePiece = grid[iterator.GetIndex()];
		
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		else {
			countSameOwner = 1;
		}
		
		if (countSameOwner == 4) {
			isWinner = true;
		}
		
		moved = iterator.StepNE();
	}
	return isWinner;
};

exports.Connect4GameBoard.prototype.IsWinnerSouthEastToNorthWest = function(grid, col, row, ROW_SIZE, COL_SIZE)
{
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	
	var iterator = new GridIteratorJS.GridIterator(grid, Math.min(col+(((PIECES_TO_WIN-1) < row)? (PIECES_TO_WIN-1):row),COL_SIZE-1), Math.max(row-(PIECES_TO_WIN-1),0), ROW_SIZE, COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	var countSameOwner = 1;
	
	var previousOwnerID = -1;
	var isWinner = false;
	var moved = true;
	
	while (!isWinner && moved) {
		currentGamePiece = grid[iterator.GetIndex()];
		
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		else {
			countSameOwner = 1;
		}
		
		if (countSameOwner == 4) {
			isWinner = true;
		}
		
		moved = iterator.StepNW();
	}
	return isWinner;
};

exports.Connect4GameBoard.prototype.IsWinnerHorizontally = function(grid, col, row, ROW_SIZE, COL_SIZE) 
{
	ValidateObjectController.ValidateNumber(row);
	var iterator = new GridIteratorJS.GridIterator(grid, 0, row, this.ROW_SIZE, this.COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	
	var countSameOwner = 1;
	
	var previousOwnerID = -1;//currentGamePiece.GetOwnerID();
	var isWinner = false;
	var moved = true;
	
	while (!isWinner && moved) {
		currentGamePiece = grid[iterator.GetIndex()];
		
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		} else {
			countSameOwner = 1;
		}
		
		if (countSameOwner == 4) {
			isWinner = true;
		}
		moved = iterator.StepColumnForward();
	}
	
	return isWinner;
};

exports.Connect4GameBoard.prototype.IsWinnerVertically = function(grid, col, row, ROW_SIZE, COL_SIZE) {
	ValidateObjectController.ValidateNumber(col);
	var iterator = new GridIteratorJS.GridIterator(grid, col, 0, this.ROW_SIZE, this.COL_SIZE);
	var currentGamePiece = grid[iterator.GetIndex()];	
	var countSameOwner = 1;
	
	if (!currentGamePiece) {
		return false;
	}	
	var previousOwnerID = currentGamePiece.GetOwnerID();
	var isWinner = false;
	
	var moved = true;
	while (!isWinner && moved) {
		moved = iterator.StepRowForward();
		currentGamePiece = grid[iterator.GetIndex()];
		
		if (currentGamePiece && previousOwnerID == currentGamePiece.GetOwnerID()) {
			countSameOwner = countSameOwner + 1;
		}
		else if (currentGamePiece) {
			previousOwnerID = currentGamePiece.GetOwnerID();
			countSameOwner = 1;
		}
		
		if (countSameOwner === 4){
			isWinner = true;
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

exports.Connect4GameBoard.prototype.PlayMoveOnBoard = function(initmove)
{
	ValidateObjectController.ValidateObject(initmove);
	
	if (this.isWinner) {
		return;
	}
	
	var lmove = this.GetLocationIfDropGamePieceAtCol(initmove.x);
	var newy = 0;

	if (lmove) {
		newy = lmove.y+1;
	}
	else {
		newy = 0;
	}
	
	var move = {x:initmove.x, y:newy, player:initmove.player};
	
	var iterator = new GridIteratorJS.GridIterator(this.grid,move.x, move.y, this.ROW_SIZE, this.COL_SIZE);
	var connect4GamePiece = this.grid[iterator.GetIndex()];
	
	if (!connect4GamePiece) {
		this.grid[iterator.GetIndex()] = new Connect4GamePiece.Connect4GamePiece({
			player: move.player, 
			pieceID: this.lastPieceID
			});
		this.lastPieceID++;
		this.userToPlay = this.GetNextTurnsPlayer();
		this.moves.push(move);
		
		var won = this.IsWinner(move.x, move.y);
		
		if (won)
		{
			this.winner = move.player;
		}
	}
	else {
		throw new Error('A game piece already exists at this location.');
	}
};
