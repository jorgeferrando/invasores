var canvas = document.getElementById('game');
var ctx = canvas.getContext && canvas.getContext('2d');

if (!ctx) {
	//No 2d context available
	alert('Please, update your browser');
} else {
	startGame();
}

function startGame() {
	var ss = new SpriteSheet();
	ss.load({
		ship: {
			sx: 0,
			sy: 0,
			w: 37,
			h: 42,
			frames: 1
		}
	}, function () {
		ss.draw(ctx,"ship",0,0);
		ss.draw(ctx,"ship",100,50);
		ss.draw(ctx,"ship",150,100);
	});
}