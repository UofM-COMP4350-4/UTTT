var ValidateObjectController = require("../.././controllers/ValidateObjectController.js");

exports.Connect4Move = function(x, y, player)
{
	ValidateObjectController.ValidateObject(player);
	ValidateObjectController.ValidateNumber(x);
	ValidateObjectController.ValidateNumber(y);
	this.x = x;
	this.y = y;
	this.player = player;
};

exports.Connect4Move.prototype.GetPlayer = function()
{
	return this.player;
};