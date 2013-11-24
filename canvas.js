var fs = require('fs'),
    Canvas = require('../node-openvg-canvas/lib/canvas'),
    Image = Canvas.Image,
    canvas= new Canvas(1920, 1080),
    ctx = canvas.getContext('2d'),
    ue = require('../node-openvg-canvas/examples/util'),
    cards = fs.readFileSync('public/img/cards.png'),
    arrow = fs.readFileSync('public/img/arrow.png'),
    ip = require('os').networkInterfaces().eth0[0].address;

function initCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle='#355e3b';
	ctx.save();
	ctx.fillRect(0, 0, canvas.width, canvas.height);		
	canvas.vgSwapBuffers();
/*	ctx.fillStyle='#EDFD44';
	ctx.fillText('http://'+ip+':8080/', canvas.width/2, 800);*/
}

function drawInstance(players, card, umflaturi, current_player) {
	initCanvas();
	console.log(card);
	var y = card.type * 98,
	    x = (card.rank) * 73,
	    w = 73,
	    h = 98;
	console.log(x," ", y);
	var img = new Image();
	img.src = cards;
	ctx.drawImage(img, x, y, w, h, 1000, 400, w*3, h*3);
//	ctx.drawImage(img, img.width, img.height);
	
	
	//Users
	ctx.font = '48pt Arial';
	ctx.fillStyle='#002800';
	ctx.textBaseline = 'center';
	ctx.textAlign = 'left';
	ctx.strokeStyle='blue';	
	for (var i = 0; i < players.length; ++i)
		ctx.fillText(players[i],400, 200+i*100);
	if (current_player > -1) {
		current_player = current_player%players.length;
		img.src = arrow;
		ctx.drawImage(img, 200,100+ current_player*100);
	}

	ctx.strokeStyle='red';
	ctx.fillStyle='red';
	ctx.fillText('Umflaturi: '+umflaturi, 1200, 200);
	

	//Swap them buffers
	canvas.vgSwapBuffers();
}

initCanvas();

//33

function drawWinScreen(players) {
	initCanvas();
	ctx.font = '50pt Arial';
	ctx.fillStyle = '#E82020';
	ctx.textBaseline = 'center';
	ctx.textAlign = 'center';
	ctx.fillText('Clasament', canvas.width/2, 200);
	ctx.font = '38pt Arial';
	ctx.fillStyle = '#0D0D90';
	ctx.strokeStyle = '#0D0D90';
	for (var i = 0 ; i < players.length; ++ i) 
		ctx.fillText((i+1).toString()+'. '+players[i], canvas.width/2, 400+i*100);
	canvas.vgSwapBuffers();	
}

// drawWinScreen(['Tataie', 'Nicu', 'Alex']);
// ue.waitForInput();

exports.initCanvas = initCanvas;
exports.drawInstance = drawInstance;
