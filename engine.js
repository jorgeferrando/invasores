var SpriteSheet = (function() {
	var that = this;
	that.map = {};
	that.load = function(spriteData, callback) {
		that.map = spriteData;
		that.image = new Image();
		that.image.onload = callback;
		that.image.src = 'images/sprites.png';
	};
	that.draw = function(ctx, sprite, x, y, frame) {
		var s = this.map[sprite];
		if (!frame) {
			frame = 0;
		}
		ctx.drawImage(this.image,
			s.sx + frame * s.w,
			s.sy,
			s.w,
			s.h,
			Math.floor(x),
			Math.floor(y),
			s.w,
			s.h);
	};
	return that;
})();

var Game = (function() {
	var KEY_CODES = {
		37: 'left',
		39: 'right',
		32: 'fire'
	},
	boards = [],
	that = this;

	that.keys = {};

	this.initialize = function(canvasId, spriteData, callback) {
		this.canvas = document.getElementById(canvasId);
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		if (!this.ctx) {
			//No 2d context available
			alert('Please, update your browser');
		}

		this.setupInput();
		this.loop();
		SpriteSheet.load(spriteData, callback);
	};
	this.setupInput = function() {
		window.addEventListener('keydown', function(e) {
			if (KEY_CODES[event.keyCode]) {
				that.keys[KEY_CODES[event.keyCode]] = true;
				e.preventDefault();
			}
		}, false);

		window.addEventListener('keyup', function(e) {
			if (KEY_CODES[event.keyCode]) {
				that.keys[KEY_CODES[event.keyCode]] = false;
				e.preventDefault();
			}
		}, false);
	};
	this.loop = function() {
		var dt = 30 / 1000;

		for (var i = 0, len = boards.length; i < len; i++) {
			if (boards[i]) {
				boards[i].step(dt);
				boards[i].draw(Game.ctx);
			}
		}

		setTimeout(Game.loop, 30);
	};

	// Change an active game board
	this.setBoard = function(num, board) {
		boards[num] = board;
	};
	return this;
})();