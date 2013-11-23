/*
 * Import modules
 */

var express = require('express');

var app = express();
var server = require('http').createServer(app);
var	io = require('socket.io').listen(server);
var Shuffle = require('shuffle');

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

var Game;

io.sockets.on('connection', function (socket) {

	if (Game.getNrPlayers() === 5) {
		socket.emit('game:info', 'Max number of players reached!');
		return;
	}

	var playerID = Game.addPlayer(socket);
	
	console.log('PlayerID: ', playerID);

	io.sockets.clients().forEach(function (socket) {
		console.log(socket.id);
	});
	
	socket.emit('init', 'Init message');

	socket.on('disconnect', function () {
		console.log('user disconected', socket.id);
	});
	
	socket.on('game:place-card', function(card) {
		Game.placeCard(card, playerID);
	});

	console.log("CLIENT SOCKET ID: ", socket.id);
	console.log("NR OF USERS: ", io.sockets.clients().length);
});


function Player(socket, id) {

	var name = 'Guest' + id;
	
	console.log('Player', name, 'joined the game!');

	this.name = name;
	this.socket = socket;
	this.cards = [];
};

Player.prototype.sync = function sync() {
	this.socket.emit('game:sync', this.cards);	
};

Player.prototype.removeCard = function removeCard(card) {
	for (var i = 0; i < this.cards.length; i++) {
		if (this.cards[i].type === card.type && 
			this.cards[i].nr === card.nr) {
			this.cards.splice(i, 1);
			return;			
		}
	}
	this.sync();
};

var Game = (function Game () {
	var players = [];
	var deck;
	var started = false;
	var token = 0;

	function initDeck() {
		var format = [];
		for (var i=0; i<4; i++) {
			for (var j=0; j<13; j++)
				format.push({type: i, nr: j});
		}
		
		deck = Shuffle.shuffle({deck: format});
	};
	
	function addPlayer(socket) {
		var id = players.length;
		var player = new Player(socket, id);
		players.push(player);
		
		getAction(id);
		
		return id;
	}
	
	function getNrPlayers() {
		return players.length;
	};
	
	function getAction(playerID) {
		
		players[playerID].cards = deck.draw(5);
		
		if (players.length === 2 && started === false ) {
			started = true;
			for (var i=0; i<players.length; i++) {
				if (players[i])
					players[i].sync();
			}
		}
		else {
			if (started === false) {
				players[playerID].socket.emit('game:wait');
			}
			else {
				players[playerID].sync();
			}
		}
	}
	
	function placeCard(card, playerID) {
		
		console.log('PlaceCard', playerID, token);
		
		if (playerID !== token) {
			console.log('Not available');
			return;
		}

		console.log(players[playerID].name + " placed: ", card.type, card.nr);
		deck.putOnBottomOfDeck({type: card.type, nr: card.nr});
		players[playerID].removeCard(card);
	}
	
	function nextToken() {
		tocken = ((token + 1) / players.length) | 0;
	}
	
	function start() {
		socket.broadcast.emit('user connected');
	}
	
	function end() {
	
	}
		
	initDeck();
	
	return {
		start : start,
		end : end,
		getNrPlayers : getNrPlayers, 
		addPlayer : addPlayer,
		placeCard : placeCard,
	};

})();





