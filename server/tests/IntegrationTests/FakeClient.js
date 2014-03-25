var assert = require('assert');
var io = require('socket.io-client');
var restify = require('restify');

var rest_port = 80;
var port = 10089;
var socket_url = 'http://0.0.0.0:' + port;

var web_url = 'http://'

var options = {
  transports: ['websocket'],
  'force new connection': true
};


var zapp_socket;
var braico_socket;

var zapp_client; //restify
var braico_client; //restify

describe("Integration Tests -- [Fake] Client Socket(s) communicating with Server", function()
{
	//first step
	it('Connection Socket -- User Setup', function()
	{
		zapp_socket = io.connect(socket_url, options);
		zapp_client = restify.createJsonClient({
			url:web_url + ":" + rest_port,
			version:"*"
		});
		
		braico_socket = io.connect(socket_url, options);
		braico_client = restify.createJsonClient({
			url:web_url + ":" + rest_port,
			version:"*"
		});
		
		var braico_data = {userid:102, name:"Braico"};
		var zapp_data = {userid:101, name:"Zapp"};
		
		var callback = function(response)
		{
			response.on('error', function(err){
				console.log("Error received " + err);
			
			});
			response.on('data', function(chunk){					
				userData += chunk;
			});
			
			response.on('end', function(){
				console.log(userData);
				userData = JSON.parse(userData);//parse out the JSON object
				assert.notEqual(response.statusCode, 200);
				
				assert.notEqual(userData, undefined);
				assert.equal((typeof userData.user), "object");
				assert.ok((userData.availableGames instanceof Array));
				assert.equal((typeof userData.active), "object");
				done();
			});		
		};
		
		zapp_client.post("/initialize?userid="+zapp_data.userid}, callback);
		braico_client.post("/initialize?userid="+braico_data.userid, callback);
	});
	//second step
	it('Connection Socket -- queueForGame (rest)', function()
	{
		//failed
		//succesful
	});
	it('Connection Socket -- Match Found Event', function()
	{
		//failed
		//succesful
	});
	it('Connection Socket -- Wait For Event', function()
	{
		//failed
		//succesful
	});
	it('receiveMove Socket', function()
	{ //send to "receiveMove" socket on server
	
		//assumed -- matchFound/WaitForEvent complete
		
		//zapp playMove
		//zapp receivePlayResult
		
		//braico receiveMove on receiveMove
		//braico receivePlayResult
		//braico playMove on receiveMove
	});
	it('receiveMove Socket -- recievePlayResult', function()
	{
	});
}); //end describe
