var SpriteSheet = function() {
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
};