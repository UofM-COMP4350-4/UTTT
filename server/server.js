var restify = require('restify');
var ecstatic = require('ecstatic');
var dataStoreController = require('./controllers/DataStoreController.js');
var dbController = new dataStoreController({username:'ubuntu', password:'', hostname:'54.186.20.243'});

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");

server.use(restify.queryParser());

server.get("/queueForGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("Queue request received from Client " + request.params.fun);
	response.writeHead(200, {"content-type": "application/json"});
	response.end(JSON.stringify({}));
	//return next();
});

server.get("/createNewGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("New game request received from Client " + request.params.fun);
	response.writeHead(200, {"content-type": "application/json"});
	response.end("Game created Successfully");
	//return next();
});

server.get("/initialize", function(request, response) {
	console.log("Received initialize request from Client " + request.params.userID); 
	//Setup a Client Id if the id passed was not found in the database
	//We have to verify that the user id passed is valid (i.e. > 0 or undefined)
	//**Account for the fact that a user id might be a string** - Right now only numbers are allowed
	//Validate the dbController Object
	var text = {};
	var id = request.params.userID;
	if (id > 0 || id === undefined) {
		//valid values: either the user doesn't have an id or the user does
		if (id !== undefined)
		{
			//just return back the userID received
			//maybe verify that it exists in the database?
			text = {userID: id};
		}
		else
		{
			//call DatabaseController and get a new userID for the user
			dbController.getNewClientID( function(newID){
				text = {userID: newID};
			});
		}
		
		response.writeHead( 200, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	}
	else
	{
		//response not found (404) but I guess any error code would work
		response.writeHead( 500, {'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
	}
	response.write(JSON.stringify(text));
	response.end();
	//return next();
});

server.get("/listOfGames", function(request, response)
{
	console.log("List of games request received from the Client");
	
	//Validate the dbController Object
	dbController.getListOfGames(function(games){
		response.writeHead(200, {"content-type": "application/json", 'Access-Control-Allow-Origin' : '*'});
		response.write(JSON.stringify(games));
		response.end();
		//return next();
	});
});


