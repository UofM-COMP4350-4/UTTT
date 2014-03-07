exports.Connect4Move = function(x, y, player)
{
	this.x = x;
	this.y = y;
	this.player = player;
};
exports.Connect4Move.prototype.GetPlayer = function()
{
	return this.player;
};