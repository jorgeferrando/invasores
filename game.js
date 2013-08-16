var canvas = document.getElementById('game');
var ctx = canvas.getContext && canvas.getContext('2d');

if (!ctx) {
	//No 2d context available
	alert('Please, update your browser');
} else {
	startGame();
}

function startGame() {
	//yellow rectangle 
	ctx.fillStyle = "#FFFF00";
	ctx.fillRect(50,100,380,400);

	//blue semitransparent rectangle
	ctx.fillStyle = "rgba(0,0,128,0.5)";
	ctx.fillRect(0,50,380,400);

	var img = new Image();
	img.onload = function () {
		ctx.drawImage(img,100,100);
	}
	img.src = 'images/sprites.png';
}