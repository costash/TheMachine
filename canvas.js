var fs = require('fs'),
    Canvas = require('../node-openvg-canvas/lib/canvas'),
    Image = Canvas.Image,
    canvas= new Canvas(1920, 1080),
    ctx = canvas.getContext('2d'),
    ue = require('../node-openvg-canvas/examples/util'),
    cards = fs.readFileSync('public/res/cards.png'),
    arrow = fs.readFileSync('public/res/arrow.png'),
    ip = require('os').networkInterfaces().eth0[0].address;

function initCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle='#355e3b';
	ctx.save();
	ctx.fillRect(0, 0, canvas.width, canvas.height);

		
	canvas.vgSwapBuffers();
	
}

function drawInstance(players, card, umflaturi, current_player) {
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
	
	
	//Users
	ctx.font = '48pt Arial';
	ctx.fillStyle='blue';
	ctx.textBaseline = 'center';
	ctx.textAlign = 'left';
	ctx.strokeStyle='blue';	
	for (var i = 0; i < players.length; ++i)
		ctx.fillText(players[i],400, 200+i*100);
	img.src = arrow;
	ctx.drawImage(img, 200,100+ current_player*100);

	//Swap them buffers
	canvas.vgSwapBuffers();


	
}

initCanvas();

drawInstance(['Nicu', 'Alex', 'Tataie'], { type:0, nr: 0}, 0, 0);
ue.waitForInput();
