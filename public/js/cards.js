var socket = io.connect();

var SUITS = ['C', 'S', 'H', 'D'];
var Deck = [];
var top_card = null;

var Draw = document.getElementById('draw');

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


var Card = function(suit, rank) {
	var card = document.createElement('div');
	card.className = 'card';
	card.id = SUITS[suit] + rank;

	card.addEventListener('click', function() {
		console.log("CARTE APASATA:", this.type, this.rank);

		if (this.type !== top_card.suit || this.rank !== 1) {
			Alert.setMesssage("You're not allowed to put down this card!");
			return;
		}


	}.bind(this));

	this.rank = rank;
	this.type = suit;
	this.node = card;

	return this;
};

Card.prototype.setSize = function setSize(w, h) {
	this.width = w;
	this.height = h;
};

Card.prototype.placeCard = function placeCard() {
	socket.emit('game:place-card', [this.suit, this.rank]);
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
