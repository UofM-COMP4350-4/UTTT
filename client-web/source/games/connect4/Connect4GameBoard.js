exports.Connect4 = function Connect4()
{
	this.max_players = 2;
	this.players = new Array();
}

exports.Connect4.prototype.addPlayer = function(Player)
{
	if (this.players.length < 2)
	{
		this.players.push(Player);
	}
	else
	{
		throw new UserException("Attempted to add more players than maximum allowed");
	}
}

exports.Connect4.prototype.requestMove = function(Move)
{

}

exports.Connect4.prototype.getResult = function()
{
	
}
