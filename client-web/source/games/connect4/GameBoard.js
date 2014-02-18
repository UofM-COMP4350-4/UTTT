function Connect4()
{
	var max_players = 2;
	var players = new Array();
}

Connect4.prototype.addPlayer = function(Player)
{
	if (players.length < 2)
	{
		players.push(Player);
	}
	else
	{
		throw new UserException("Attempted to add more players than maximum allowed");
	}
}
Connect4.prototype.requestMove = function(Move)
{

}
Connect4.prototype.getResult = function()
{
	
}
