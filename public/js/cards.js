var socket = io.connect();

var SUITS = ['C', 'S', 'H', 'D'];
var Deck = [];
var top_card = null;

var Draw = document.getElementById('draw');
var Turn = document.getElementById('turn');
var TURN = false;

Draw.addEventListener('click', function() {
	socket.emit('game:draw-card');
});

var Alert = (function() {
	var node = document.getElementById('alert');

	function setMesssage(msg) {
		console.log('MESSAGE SET');
		setTimeout(hideAllert, 500);
		node.setAttribute('data-hidden', 'false');
		node.textContent = msg;
	}

	function hideAllert() {
		console.log('MESSAGE HIDDEN');
		node.removeAttribute('data-hidden');
	}

	return {
		setMesssage : setMesssage
	};

})();


var Card = function(type, rank) {
	var card = document.createElement('div');
	card.className = 'card';
	card.id = SUITS[type] + rank;

	card.addEventListener('click', function() {
		if (TURN === false) {
			Alert.setMesssage("Wait for your turn!");
			return;
		}
		
		console.log("CARTE APASATA:", this.type, this.rank);
		console.log("CARTE TOP:", top_card.type, top_card.rank);

		if (this.rank === top_card.rank) {
			this.placeCard(this.type, this.rank);
			return;
		}

		if (this.type === top_card.type || this.rank === 1) {
			this.placeCard(this.type, this.rank);
			return;
		}
		
		Alert.setMesssage("You're not allowed to put down this card!");

	}.bind(this));

	this.rank = rank;
	this.type = type;
	this.node = card;

	return this;
};

Card.prototype.setSize = function setSize(w, h) {
	this.width = w;
	this.height = h;
};

Card.prototype.placeCard = function placeCard() {
	socket.emit('game:place-card', {type: this.type, rank: this.rank});
};

/*
 * Create the deck of cards
 */

var card_container = document.getElementById('cards');

for (var i=0; i<=3; i++) {
	for (var j=1; j<=13; j++) {
		Deck.push(new Card(i, j));
	}
}

socket.on('game:turn', function(value) {
	TURN = value;
	console.log('TURN', value);
	if (value === true)
		Turn.setAttribute('data-turn', 'true');
	else
		Turn.removeAttribute('data-turn');
});

socket.on('game:top', function(card) {
	top_card = card;
	console.log('TOP CARD:', top_card);
});

socket.on('game:sync', function (data) {
	card_container.textContent = '';
	console.log(data);

	top_card = data.top;
	var cards = data.hand;

	console.log('TOP CARD:', top_card);

	for (var i in cards) {
		var cardID = cards[i].type * 13 + cards[i].rank - 1;
		card_container.appendChild(Deck[cardID].node);
	}
});
