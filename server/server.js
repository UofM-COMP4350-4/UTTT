var restify = require('restify');
var ecstatic = require('ecstatic');

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");
server.use(restify.queryParser());

server.get("/createGame", function(request, response, next){
	//We need to Setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object
	console.log("Client msg received " + request.params.fun);
	response.writeHead(200, {"content-type": "application/json"});
	response.end("Game created Successfully");
});

server.get("/initialize", function(request, response) {
	console.log("Received initialize request from Client " + request.params.userID); 
	//Setup a Client Id if the id passed was not found in the database
	var text = {userID: "Initialized successfully"};
	response.writeHead( 200, {"content-type": "application/json"});
	response.write(JSON.stringify(text));
	response.end();
});


