var GridIteratorJS = require(".././GridIterator.js");
var ValidateObjectController = require("../.././controllers/ValidateObjectController.js")
var Connect4GamePiece = require("./Connect4GamePiece.js")

exports.Connect4.prototype.PIECES_TO_WIN = 4;

exports.Connect4GameBoard = function Connect4GameBoard(gameInfo)
{
	this.gameID = gameInfo.gameID;
	this.instance_id = gameInfo.instanceID;
	this.userToPlay = gameInfo.userToPlay;
	this.ROW_SIZE = 6;
	this.COL_SIZE = 7;
	this.maxPlayers = 2;
	this.players = [gameInfo.player1, gameInfo.player2];
	this.grid = new Array[this.ROW_SIZE * this.COL_SIZE];
	this.IsWinner = false;
}

exports.Connect4GameBoard.prototype.GetLocationIfDropGamePieceAtCol(col) {
	ValidateObjectController.ValidateNumber(col);
	var move = null;

	var iterator = new GridIteratorJS.GridIterator(this.grid, col, 0, this.ROW_SIZE, this.COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];
	
	if (currentGamePiece == undefined) {
		while (currentGamePiece != null && currentGamePiece == undefined) {
			iterator.StepRowForward();
			currentGamePiece = this.grid[iterator.GetIndex()];
		}
		
		iterator.StepRowBackward();
		move = new Connect4Move(iterator.row,iterator.col);
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

exports.Connect4GameBoard.prototype.IsPlayersTurn(Move) {
	ValidateObjectController.ValidateObject(move);
	var playerID = move.player.id;
	
	if (userToPlay.id == playerID) {
		return true;
	}
	else {
		return false;
	}
}

exports.Connect4GameBoard.prototype.GetNextTurnsPlayerID() {
	ValidateObjectController.ValidateNumber(currentID);
	var nextPlayersID = null;
	var turnPlayersID = userToPlay.id;
	
	for (var index = 0; index < players.length; index++) {
		if (turnPlayersID != players[index].id) {
			nextPlayersID = players[index].id;
		}
	}
	
	return nextPlayersID
}

exports.Connect4GameBoard.prototype.PlayMoveOnBoard = function(move)
{
	ValidateObjectController.ValidateObject(move);
	var iterator = new GridIteratorJS.GridIterator(grid, move.x, move.y, ROW_SIZE, COL_SIZE);
	var connect4GamePiece = this.grid[iterator.GetIndex()];
	
	if (connect4GamePiece == undefined) {
		this.grid[iterator.GetIndex()] = new Connect4GamePiece.Connect4GamePiece(Move.GetPlayer());
		userToPlay = this.GetNextTurnsPlayerID();
	}
	else {
		throw new Error('A game piece already exists at this location.');
	}
}