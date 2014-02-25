var restify = require('restify');
var ecstatic = require('ecstatic');

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");
server.use(restify.queryParser());

server.get("/createGame", function(request, response, next){
	//We need to setup a new game in the database between two players
	//Create a flat file for the board data
	//Then send back the board object 
	console.log("Client msg received " + request.params.fun);
	//console.log("Received request from Client " + request.fun);
	response.end("");
});

server.get("/initialize", function(request, response) {
	console.log("Received initialize request from Client " + request.params.userID); 
	response.end("");
});


