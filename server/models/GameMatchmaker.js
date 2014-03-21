// GameMatchmaker.js
// Model that holds the matchmaking queues for each game
/*globals GameMatchmaker */
var validator = require('../controllers/ValidateObjectController.js');
var gameQueue = [];
exports.GameMatchmaker = function() {}; // constructor

exports.GameMatchmaker.clearQueue = function() {
	gameQueue = {};
};

//Player joins the queue
exports.GameMatchmaker.joinQueue = function(userID,gameID){
	validator.ValidateNumber(userID);
	validator.ValidateNumber(gameID);
	if ((typeof gameQueue[gameID]) === 'undefined' || !gameQueue[gameID])
	{
		gameQueue[gameID] = [];
	}
	if(gameQueue[gameID].indexOf(userID)<0) {
		gameQueue[gameID].push(userID);
	}
};

exports.GameMatchmaker.getGameQueue = function(gameID){
	validator.ValidateArgs(arguments, Number);
	if(!gameQueue[gameID]){
		gameQueue[gameID] = [];
	}
	return gameQueue[gameID];
};

exports.GameMatchmaker.totalPlayers = function(){
	var count = 0;
	for (var n in gameQueue) {
		count += this.queueTotal(parseInt(n, 10));
	}
	return count;
};

exports.GameMatchmaker.queueTotal = function(gameID){
	validator.ValidateArgs(arguments, Number);
	var q = this.getGameQueue(gameID);
	return q.length;
};

exports.GameMatchmaker.removeFromQueue = function(userID){
	validator.ValidateArgs(arguments, Number);
	var newList = [];
	for(var i in gameQueue){
		i = parseInt(i, 10);
		var q = this.getGameQueue(i);
		var i=q.indexOf(userID);
		if(i>=0) {
			q.splice(i, 1);
		}
	}
};
