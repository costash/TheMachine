var socket = io.connect();

socket.on('init', function (data) {
	console.log(data);
});