// GameMatchmaker.js
// Model that holds the matchmaking queues for each game
/*globals GameMatchmaker */
var validator = require('../controllers/ValidateObjectController');
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
	if ((typeof gameQueue[game.id]) === 'undefined' || !gameQueue[game.id])
	{
		gameQueue[game.id] = [];
	}
	gameQueue[game.id].push(player);
	callback(gameQueue);
};

exports.GameMatchmaker.getGameQueue = function(game,callback){
	validator.ValidateArgs(arguments, Object, Function);
	var gameQ = gameQueue[game.id];
	if(gameQ == null){
		gameQ = [];
	}
	callback(gameQ);
};

exports.GameMatchmaker.totalPlayers = function(callback){
	validator.ValidateArgs(arguments,Function);
	var count = 0;
	for (var n in gameQueue) {
		for (var u in gameQueue[n]) {
			//console.log("bob " + gameQueue[0][u]);
			count += 1;
		}
	}
	callback(count);
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
		for (var j in gameQueue[i]) {
			if(gameQueue[i][j].id == player.id){
				gameQueue[i].splice(gameQueue[i].indexOf(player), 1);
			}
		}
	}
	callback();
};
