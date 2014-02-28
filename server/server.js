var restify = require('restify');
var ecstatic = require('ecstatic');

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
});

server.get("/createNewGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("New game request received from Client " + request.params.fun);
	response.writeHead(200, {"content-type": "application/json"});
	response.end("Game created Successfully");
});

server.get("/initialize", function(request, response) {
	console.log("Received initialize request from Client " + request.params.userID); 
	//Setup a Client Id if the id passed was not found in the database
	//We have to verify that the user id passed is valid (i.e. > 0 or undefined)
	var id = request.params.userID;
	if (id > 0 || id == undefined) {
		//valid values: either the user doesn't have an id or the user does
		
		var text = {userID: 1};//send back 1 for every client until we create a new user id for everyone
		response.writeHead( 200, {"content-type": "application/json"});
		response.write(JSON.stringify(text));
	}
	else
	{
		//response not found
		response.writeHead( 500, {"content-type": "application/json"});
	}
	
	response.end();
});

server.get("/listOfGames", function(request, response)
{
	console.log("List of games request received from the Client");
	
	var games = {"abc123":"game name", "go jason":"good work"};
	
	response.writeHead(200, {"content-type": "application/json"});
	response.write(JSON.stringify(games));
	response.end();
});


