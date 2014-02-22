var ValidateObjectController = require("../../controllers/ValidateObjectController.js")

exports.Iterator = function(grid, column, row)
{
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateObject(column);
	ValidateObjectController.ValidateObject(row);
	//ValidateColumnRowLocations(column, row);
	//ValidateGridSize(grid)
	
	this.grid = grid;
	this.column = column;
	this.row = row;
	this.row_size = 6;
	this.col_size = 7;
	this.index = row * this.row_size + column;
}

function ValidateColumnRowLocations(column, row) {
	if (column > this.col_size) {
		// error
	}
	
	if (row > this.row_size) {
		// error
	}
}

exports.Iterator.prototype.Move = function(rowDiff, colDiff)
{
	return rowDiff*this.row_size + colDiff;
}
exports.Iterator.prototype.StepRowBack = function ()
{
	if (this.row >= 0)
		this.index = this.index-this.move(0, 1);
}

exports.Iterator.prototype.StepColumnBack = function ()
{
	if (this.column >= 0)
		this.index = this.index - this.move(1,0);
}

exports.Iterator.prototype.StepDiagonalForward = function ()
{
	if (this.row < this.row_size -1 && this.column < this.col_size -1)
		this.index = this.index + this.move(1,1);
}

exports.Iterator.prototype.StepRowForward = function ()
{
	if (this.row < this.row_size -1)
		this.index = this.index + this.move(0,1);// (index - column) / row_size;
}

exports.Iterator.prototype.StepColumnForward = function ()
{
	if (this.column < this.col_size-1)
		this.index = this.index + this.move(1, 0);
}

exports.Iterator.prototype.StepDiagonalForward = function ()
{
	if (this.row < this.row_size-1 && this.column < this.col_size-1)
		this.index = this.index + this.move(1,1);
}

exports.Iterator.prototype.StepABS = function(row, column)
{
	if (row >= 0 && column >= 0 && row < this.row_size && column <= this.col_size)
	{
		this.index = row*this.row_size + column;
	}
}

exports.Iterator.prototype.GetIndex = function()
{
	return this.index;	
}
