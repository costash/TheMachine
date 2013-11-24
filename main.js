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
var RASB = require('./canvas');


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

	socket.on('disconnect', function () {
		console.log('user disconected', socket.id);
	});

	socket.on('game:draw-card', function(){
		Game.drawCard(playerID);
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
	this.socket.emit('game:sync', {top: Game.getTopCard(), hand: this.cards});
};

Player.prototype.removeCard = function removeCard(card) {
	PP.log(this.cards);

	for (var i = 0; i < this.cards.length; i++) {
		if (this.cards[i].type === card.type &&
			this.cards[i].rank === card.rank) {
			this.cards.splice(i, 1);
			this.sync();
			return;
		}
	}
};

Player.prototype.syncTurn = function (value) {
	this.socket.emit('game:turn', value);
};

Player.prototype.syncTop = function (card) {
	this.socket.emit('game:top', card);
};

var pl = ['Gabi', 'Alex', 'Mircea', 'Costash'];

var Game = (function Game () {
	var players = [];
	var Deck;
	var started = false;
	var token = 0;
	var top_card = null;

	function initDeck() {
		var format = [];
		for (var i=0; i<4; i++) {
			for (var j=0; j<13; j++)
				format.push({type: i, rank: j});
		}

		Deck = Shuffle.shuffle({deck: format});
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

		players[playerID].cards = Deck.draw(5);

		if (players.length === 2 && started === false ) {
			started = true;
			top_card = Deck.draw();
			RASB.drawInstance(pl, top_card, 0, token);
			sendTurnInfo();
			
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
				sendTurnInfo();
			}
		}
	}
	
	function sendTurnInfo() {
		for (var i=0; i<players.length; i++) {
			if (i != token)
				players[i].syncTurn(false);
		}
		players[token].syncTurn(true);
		players[token].syncTop(top_card);
	}

	function placeCard(card, playerID) {

		console.log('PlaceCard', playerID, token);

		if (playerID !== token) {
			return;
		}

		console.log(players[playerID].name + " placed: ", card.type, card.rank);
		Deck.putOnBottomOfDeck(card);
		players[playerID].removeCard(card);
		top_card.type = card.type;
		top_card.rank = card.rank;
		nextToken();
		RASB.drawInstance(pl, top_card, 0, token);		
	}

	function nextToken() {
		console.log('Last player:', token);				
		do {
			token = (token + 1) % players.length;
		} while(players[token] === null);
		console.log('Next player:', token);				
		sendTurnInfo();
	}

	function drawCard(playerID) {

		console.log("PLAYER DRAWS CARD");

		if (playerID !== token) {
			return;
		}

		var card = Deck.draw();
		if (card) {
			players[playerID].cards.push(Deck.draw());
			players[playerID].sync();
		}
		nextToken();
		RASB.drawInstance(pl, top_card, 0, token);
		PP.log(top_card);
	}

	function getTopCard() {
		return top_card;
	}

	initDeck();

	return {
		drawCard : drawCard,
		getNrPlayers : getNrPlayers,
		addPlayer : addPlayer,
		placeCard : placeCard,
		getTopCard : getTopCard
	};

})();





