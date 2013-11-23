function loadImage(URL, imageObj) {
	imageObj.onload = function() {
		
	}
	
	imageObj.src = URL;
}

var SUITS = ['C', 'S', 'H', 'D'];
var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
var cards = [];

var Card = function(rank, suit) {
	var card = document.createElement('li');
	card.className = 'card';

	card.addEventListener('click', function() {
		socket.emit('game:place-card', [this.rank, this.suit]);
		console.log('Clicked on ' + this.rank + ' of ' + this.suit);
	}.bind(this));

	this.rank = rank;
	this.suit = suit;

	this.card = card;

	this.setImagePos(RANKS.indexOf(rank), SUITS.indexOf(suit));

	return this;
};

Card.prototype.setSize = function setSize(w, h) {
	this.width = w;
	this.height = h;
}

Card.prototype.setImagePos = function setImagePos(x, y) {
	this.card.style.backgroundPosition = 'left ' + -x * 73 + 'px top ' + -y * 98 + 'px';
}

cards.push(new Card('J', 'D'));
cards.push(new Card('A', 'H'));
cards.push(new Card('T', 'S'));
cards.push(new Card('4', 'C'));
for (var i = 0; i < 20; ++i) {
	cards.push(new Card(RANKS[i % 13], SUITS[i % 4]));
}

function attachToDom(cards) {
	for(var i = 0; i < cards.length; ++i) {
		$('#cards ul').append(cards[i].card);
	}
}

attachToDom(cards);