var ValidateObjectController = require("../.././controllers/ValidateObjectController.js")

exports.Connect4GamePiece = function Connect4GamePiece(pieceInfo)
{
	ValidateObjectController.ValidateObject(player);
	this.player = pieceInfo.player;
	this.pieceID = pieceInfo.pieceID;
}

exports.Connect4GamePiece.prototype.GetOwnerID = function() {
	return this.player.id;
}