var socket = io.connect();

socket.on('init', function (data) {
	console.log(data);
});

socket.on('game:sync', function (data) {
	console.log(data);
	socket.emit('game:place-card', data[0]);
});