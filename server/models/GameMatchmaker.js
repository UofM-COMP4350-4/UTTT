// GameMatchmaker.js
// Model that holds the matchmaking queues for each game
/*globals GameMatchmaker */
var validator = require('../controllers/ValidateObjectController');
//var _ = require('underscore');
var gameQueue = [];
exports.GameMatchmaker = function() {}; // constructor

exports.GameMatchmaker.clearQueue = function() {
	gameQueue = [];
};

//Player joins the queue
exports.GameMatchmaker.joinQueue = function(player,game,callback){
	validator.ValidateObject(player);
	validator.ValidateObject(game);
	validator.ValidateFunction(callback);//(arguments, Object, Object, Function);
	var newPlayer = {'player':player};
	if (!gameQueue[game])
	{
		gameQueue[game] = [];
	}
	gameQueue[game].push(newPlayer);
	callback(gameQueue);
};

exports.GameMatchmaker.getGameQueue = function(game,callback){
	validator.ValidateArgs(arguments, Object, Function);
	var gameQ = gameQueue[game];
	if(gameQ == null){
		gameQ = [];
	}
	callback(gameQ);
};

exports.GameMatchmaker.totalPlayers = function(callback){
	validator.ValidateArgs(arguments,Function);
	var count
	for (var n in gameQueue) {
		n += n.length;
	}
	callback(n);
};

exports.GameMatchmaker.queueTotal = function(game,callback){
	validator.ValidateArgs(arguments, Object, Function);
	this.getGameQueue(game, function(q){
		callback(q.length);	
	});
};

exports.GameMatchmaker.removeFromQueue = function(player,callback){
	validator.ValidateArgs(arguments, Object, Function);
	var newList = [];
	for(var i in gameQueue){
		if(gameQueue[i][player]){
			gameQueue[i].splice(gameQueue[i].indexOf(player), 1);
		}
	}
	callback();
};
