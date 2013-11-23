function loadImage(URL, imageObj) {
	imageObj.onload = function() {
		
	}
	
	imageObj.src = URL;
}

var SUITS = ['C', 'S', 'H', 'D'];
var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

var Card = function(rank, suit) {
	var card = document.createElement('div');
	card.className = 'card';

	this.rank = rank;
	this.suit = suit;

	this.card = card;

	this.setImagePos(RANKS.indexOf(rank), SUITS.indexOf(suit));
	return this;
};

Card.prototype.setPosition = function _position(x, y) {
	this.x = x;
	this.y = y;   
};

Card.prototype.setSize = function setSize(w, h) {
	this.width = w;
	this.height = h;
}

Card.prototype.setImagePos = function setImagePos(x, y) {
	this.card.style.backgroundPositionX = -x * 73 + 'px';
	this.card.style.backgroundPositionY = -y * 98 + 'px';
}

var c = new Card('J', 'D');

$('#container').append(c.card);
