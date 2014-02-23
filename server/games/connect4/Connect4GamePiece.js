exports.Connect4GamePiece = function Connect4GamePiece(player)
{
	this.player = player;
}

exports.Connect4GamePiece.prototype.GetOwnerID() {
	return this.player.id;
}