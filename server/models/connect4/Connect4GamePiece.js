var ValidateObjectController = require("../.././controllers/ValidateObjectController.js")

exports.Connect4GamePiece = function Connect4GamePiece(player)
{
	ValidateObjectController.ValidateObject(player);
	this.player = player;
}

exports.Connect4GamePiece.prototype.GetOwnerID() {
	return this.player.id;
}