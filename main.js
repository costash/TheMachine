/*
 * Import modules
 */

var express = require('express');

var app = express();
var server = require('http').createServer(app);
var	io = require('socket.io').listen(server);

/*
 * Custom modules
 */
var PP = require('modules/prettyprint');


/*
 * Start Server
 */

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res ) {

});

server.listen(process.argv[2]);

io.sockets.on('connection', function (socket) {

	console.log("CLIENT SOCKET ID: ", socket.id);
	console.log("NR OF USERS: ", io.sockets.clients().length);

	io.sockets.clients().forEach(function (socket) {
		console.log(socket.id);
	});

	socket.emit('init', 'Init message');

	socket.on('disconnect', function () {
		console.log('user disconected', socket.id);
	});
});











