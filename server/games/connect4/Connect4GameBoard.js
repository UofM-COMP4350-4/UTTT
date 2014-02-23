var GridIteratorJS = require("./GridIterator.js");
var ValidateObjectController = require("../../controllers/ValidateObjectController.js")
var Connect4GamePiece = require("Connect4GamePiece.js")

exports.Connect4.PIECES_TO_WIN = 4;

exports.Connect4 = function Connect4()
{
	this.ROW_SIZE = 6;
	this.COL_SIZE = 7;
	this.max_players = 2;
	this.players = new Array();
	this.grid = new Array[ROW_SIZE * COL_SIZE];
	this.IsWinner = false;
}

exports.Connect4.prototype.IsWinner(row, col) {
	ValidateObjectController.ValidateObject(row);
	ValidateObjectController.ValidateObject(col);
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
}

function IsWinnerSouthWestToNorthEast(grid, row, col) {
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateObject(row);
	ValidateObjectController.ValidateObject(col);
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
	ValidateObjectController.ValidateObject(row);
	ValidateObjectController.ValidateObject(col);
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
	ValidateObjectController.ValidateObject(row);
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
	ValidateObjectController.ValidateObject(col);
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

exports.Connect4.prototype.AddPlayer = function(player)
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

exports.Connect4.prototype.RequestMove = function(Move)
{
	if (this.IsValidMove(Move.row, Move.col)) {
		this.grid[iterator.GetIndex()] = new Connect4GamePiece.Connect4GamePiece(Move.GetPlayer());
		
		if (this.IsWinner(Move.row, Move.col)) {
			// send message to both players saying that x has won
		}
		else {
			// send message to opponent with new move
		}
	}
}

exports.Connect4.prototype.IsValidMove(row, col) {
	var IsValidMove = true;
	var iterator = new GridIteratorJS.GridIterator(grid, col, row, ROW_SIZE, COL_SIZE);
	var currentGamePiece = this.grid[iterator.GetIndex()];
	
	if (currentGamePiece == undefined || currentGamePiece == null) {
		return true;
	}
	else {
		return false;
	}
}

exports.Connect4.prototype.getResult = function()
{
	
}
