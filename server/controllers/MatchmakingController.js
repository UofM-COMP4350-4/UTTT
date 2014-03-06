var queues = require('../models/GameMatchmaker.js');
var gameMgmnt = require('../models/GameManagement.js');
var _ = require('underscore');
var validator = require('./ValidateObjectController');

exports.MatchmakingController = function(){

};
// recieves inital queue request, validates it and passes it on to matchmaking
exports.MatchmakingController.joinMatchmaking = function(player, game, response){
	validator.ValidateArgs(arguments, Object, Object, Function);
	var gameList =[];
	var result = {};
	gameMgmnt.availableGames(function(gList){gameList = gList;});
	if(this.gameValidate(gameList,game)){ // make sure the game the client asks to queue for is a game we actually support.
		queues.GameMatchmaker.joinQueue(player,game,function(){
			this.Match(player,game,function(gameObj){result = gameObj;});
			});
		response(result);
	}
	else {response("");}
};

exports.MatchmakingController.emptyFunction = function(){
	return function(){
	};
};
exports.MatchmakingController.errLogging = function(){
	return function(err){
		if(err){
			console.log(err);
		}
	};
};

exports.MatchmakingController.Match= function(player,game,callback){
	validator.ValidateArgs(arguments, Object, Object, Function);
	if(game == null || game === undefined || game == {}){
		throw new Error("Invalid game");
	}
	var result = "";
	var gameList = [];
	queues.GameMatchmaker.getGameQueue(game, function(queue){gameList = queue});
	var numPlayers = 0;
	var playersFound = [];
	numPlayers = game['maxPlayers'];
	if(gameList.length < numPlayers){
		callback(""); // return no match found
		return;
	} else {
		//TODO elaborate on the matchmaking logic for other games
		for(var i = 0;i<numPlayers;i++){
			if(_.isEqual(gameList[i], player)){
				numPlayers++;
			}
			else{
				playersFound.push(gameList[i]);
			}
		}
		var gameObj = gameMgmnt.createMatch(0); // TODO once GameManager returns game IDs, get game IDs
	        for(i = 0; i< playersFound.length;i++){
			gameMgmnt.joinMatch(playersFound[i]['id'],gameObj, this.errLogging());
		}

		// remove both players from the matchmaking queue and return the game object;
		for(i = 0;i<playersFound.length;i++){
			queues.GameMatchmaker.removeFromQueue(playersFound[i]['player'],this.emptyFunction());
		}
		var gameBoard = {};
		gameMgmnt.getGameboard(gameObj,function(board){gameBoard = board});


		// TODO, push game board to both players and get the game started
		
		return callback(gameBoard);	
	}
};

exports.MatchmakingController.gameValidate = function(games,game){
	validator.ValidateArgs(arguments, Object, Object);
	var result = false;
	var keys = Object.keys(games);
	for(var i = 0;i<keys.length;i++){
		if(_.isEqual(games[keys[i]],game)){
			result=true;	
		}
	}
	return result;
};
