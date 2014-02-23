var ValidateObjectController = require("../.././controllers/ValidateObjectController.js")

exports.Connect4Move = function Connect4(row, col)
{
	ValidateObjectController.ValidateNumber(row);
	ValidateObjectController.ValidateNumber(col);
	this.row = row;
	this.col = col;
}