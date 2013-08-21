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

var TitleScreen = function(title, subtitle, callback) {
	this.step = function(dt) {
		if (Game.keys['fire'] && callback) {
			callback();
		}
	};
	this.draw = function(ctx) {
		ctx.fillStyle = "#FFF";
		ctx.textAlign = "center";
		ctx.font = "bold 40px bangers";
		ctx.fillText(title, Game.width / 2, Game.height / 2);
		ctx.font = "bold 20px bangers";
		ctx.fillText(subtitle, Game.width / 2, Game.height / 2 + 40);
	};
};

var GameBoard = function() {
	var board = this;
	this.objects = [];
	this.removed = [];
	this.cnt = [];

	this.add = function(obj) {
		obj.board = this;
		this.objects.push(obj);
		this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
		return obj;
	};

	this.remove = function(obj) {
		var wasStillAlive = this.removed.indexOf(obj) != -1;
		if (wasStillAlive) {
			this.removed.push(obj);
		}
		return wasStillAlive;
	};

	this.resetRemoved = function() {
		this.removed = [];
	};

	this.finalizeRemoved = function() {
		for (var i = 0, len = this.removed.length; i < len; i++) {
			var idx = this.objects.indexOf(this.removed[i]);
			if (idx != -1) {
				this.cnt[this.removed[i].type]--;
				this.objects.splice(idx, 1);
			}
		}
	};

	this.iterate = function(funcName) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, len = this.objects.length; i < len; i++) {
			var obj = this.objects[i];
			obj[funcName].apply(obj, args);
		}
	};

	this.detect = function(func) {
		for (var i = 0, val = null, len = this.objects.length; i < len; i++) {
			if (func.call(this.objects[i])) {
				return this.objects[i];
			}
		}
		return false;
	};

	this.overlap = function(o1, o2) {
		return !((o1.y + o1.h - 1 < o2.y) || (o1.y > o2.y + o2.h - 1) ||
			(o1.x + o1.w - 1 < o2.x) || (o1.x > o2.x + o2.w - 1));
	};

	this.collide = function (obj,type) {
		return this.detect(function() {
			if (obj != this) {
				var col = (!type || this.type & type) && board.overlap(obj,this);
				return col ? this : false;
			}
		});
	};

	this.step = function(dt) {
		this.resetRemoved();
		this.iterate('step', dt);
		this.finalizeRemoved();
	};

	this.draw = function(ctx) {
		this.iterate('draw', ctx);
	};
};