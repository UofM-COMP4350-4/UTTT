// GameMatchmaker.js
// Model that holds the matchmaking queues for each game
/*globals GameMatchmaker */
var validator = require('../controllers/ValidateObjectController');
var _ = require('underscore');
var gameQueue = [];
exports.GameMatchmaker = function() {}; // constructor

exports.GameMatchmaker.joinQueue = function(player,game,callback){
	validator.ValidateArgs(arguments, Object, Object, Function);
	var newPlayer = {'player':player,'game':game};
	gameQueue.push(newPlayer);
	callback(gameQueue);
};

exports.GameMatchmaker.getGameQueue = function(game,callback){
	validator.ValidateArgs(arguments, Object, Function);
	var gameQ = _.groupBy(gameQueue,'game')[game];
	if(gameQ == null){
		gameQ = [];
	}
	callback(gameQ);
};

exports.GameMatchmaker.totalPlayers = function(callback){
	validator.ValidateArgs(arguments,Function);
	callback(gameQueue.length);
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
	for(var i = 0; i<gameQueue.length;i++){
		if(gameQueue[i]['player']!=player){
			newList.push(gameQueue[i]);
		}	
	}
	gameQueue = newList;
	callback();
};
