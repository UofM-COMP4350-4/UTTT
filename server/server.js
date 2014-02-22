var restify = require('restify');
var ecstatic = require('ecstatic');

var server = restify.createServer();
server.pre(ecstatic({ root: __dirname + '/public'}));

server.listen(process.env.PORT || 80, process.env.IP);
console.log("Server started & listening on port 80");

server.get("/createGame", function(){
	console.log("Received request from Client");
});
