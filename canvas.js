var fs = require('fs'),
    Canvas = require('../node-openvg-canvas/lib/canvas'),
    Image = Canvas.Image,
    canvas= new Canvas(1920, 1080),
    ctx = canvas.getContext('2d'),
    ue = require('../node-openvg-canvas/examples/util'),
    cards = fs.readFileSync('public/res/cards.png');

function initCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle='#355e3b';
	ctx.save();
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	canvas.vgSwapBuffers();
	
}

function drawInstance(players, card, umflaturi) {
	console.log(card);
	var y = card.type*98,
	    x = card.nr * 73,
	    w = 73,
	    h = 98;
	console.log(x," ", y);
	var img = new Image();
	img.src = cards;
	ctx.drawImage(img, x, y, w, h, 1000, 400, w*3, h*3);
//	ctx.drawImage(img, img.width, img.height);
	canvas.vgSwapBuffers();
}

initCanvas();

drawInstance([], { type:0, nr: 0}, 0);
ue.waitForInput();
