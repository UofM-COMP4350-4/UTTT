var ValidateObjectController = require("../controllers/ValidateObjectController.js")
var GridValidationController = require("../controllers/GridValidationController.js")

/*	Grid Iterator
 *  Use: To be used to iterate and step through the elements in a grid of any size.
 *  Note: Data structure used to represent the Grid must be a one dimensional array.
 */

exports.GridIterator = function(grid, column, row, row_size, col_size)
{
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateNumber(column);
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(row_size);
	ValidateObjectController.ValidateNumber(col_size);
	ValidateObjectController.ValidateObjectIsOneDimensionalArray(grid);
	GridValidationController.ValidateColumnRowLocations(column, row, row_size, col_size);
	GridValidationController.ValidateGridSize(grid, row_size, col_size);

	this.row_size = row_size;
	this.col_size = col_size;	
	this.grid = grid;
	this.column = column;
	this.row = row;
	this.index = row * this.row_size + column;
}

exports.GridIterator.prototype.Move = function(rowDiff, colDiff)
{
	ValidateObjectController.ValidateNumber(rowDiff);
	ValidateObjectController.ValidateNumber(colDiff);
	
	return rowDiff * this.col_size + colDiff;
}

exports.GridIterator.prototype.StepRowBackward = function ()
{
	if (this.row >= 0) {
		this.index = this.index - this.Move(1,0);
		this.row = this.row - 1;
	}
	else {
		return null;
	}
}

exports.GridIterator.prototype.StepColumnBackward = function ()
{
	if (this.column >= 0) {
		this.index = this.index - this.Move(0,1);
		this.column = this.column - 1;
	}
	else {
		return null;
	}
}

exports.GridIterator.prototype.StepRowForward = function ()
{	
	if (this.row < this.row_size - 1) {
		this.index = this.index + this.Move(1,0);
		this.row = this.row + 1;
	}
	else {
		return null;
	}
}

exports.GridIterator.prototype.StepColumnForward = function ()
{
	if (this.column < this.col_size - 1) {
		this.index = this.index + this.Move(0,1);
		this.column = this.column + 1;
	}
	else {
		return null;
	}
}

exports.GridIterator.prototype.StepDiagonalForward = function ()
{
	if (this.row < this.row_size - 1 && this.column < this.col_size - 1) {
		this.index = this.index + this.Move(1,1);
		this.row = this.row + 1;
		this.column = this.column + 1;
	}
	else {
		return null;
	}
}

exports.GridIterator.prototype.StepDiagonalBackward = function ()
{
	if (this.row > 0 && this.column > 0) {
		this.index = this.index - this.Move(1,1);
		this.row = this.row - 1;
		this.column = this.column - 1;
	}
	else {
		return null;
	}
}

exports.GridIterator.prototype.StepToLocation = function(row, column)
{
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(column);
	GridValidationController.ValidateColumnRowLocations(column, row, this.row_size, this.col_size);
	
	if (row >= 0 && column >= 0 && row < this.row_size && column <= this.col_size)
	{
		this.index = row * this.col_size + column;
		this.row = row;
		this.column = column;
	}
	else {
		throw new Error('Cannot step to row ' + row + ' col ' + column + '.');
	}
}

exports.GridIterator.prototype.GetIndex = function()
{
	return this.index;
}