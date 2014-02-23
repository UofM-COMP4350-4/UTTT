var ValidateObjectController = require("./ValidateObjectController.js")

exports.ValidateGridSize = function(grid, row_size, col_size) {
	ValidateObjectController.ValidateObject(grid);
	ValidateObjectController.ValidateNumber(row_size);
	ValidateObjectController.ValidateNumber(col_size);

	if (grid.length == 0 && (row_size > 0 || col_size > 0)) {
		throw new Error('Grid size must be size ' + (row_size * col_size) + '.');
	}
	else if (grid.length % (row_size * col_size) != 0 && grid.length != 0) {
		throw new Error('Grid size must be size ' + (row_size * col_size) + '.');
	}
	
	return true;
}

exports.ValidateColumnRowLocations = function(column, row, row_size, col_size) {
	ValidateObjectController.ValidateNumber(column);
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(row_size);
	ValidateObjectController.ValidateNumber(col_size);
	
	if (column >= col_size) {
		throw new Error('Column must be less than ' + col_size + '.');
	}
	
	if (row >= row_size) {
		throw new Error('Row must be less than ' + row_size + '.');
	}
	
	return true;
}