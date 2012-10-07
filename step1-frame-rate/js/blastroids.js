



var blastroids = {};

blastroids.GameEngine = function(settings){
	
	// game settings
	this.canvas = settings.canvas;
	this.targetFrameRate = settings.targetFrameRate;
	this.onUpdate = settings.onUpdate || null;
	

	// internal vars
	this.paused = true;
	this.lastUpdate = null;
	this.frameRate = null;

	// in order to control the frame rate
	// we need to determine how many milliseconds
	// must elapse in order for us to update the game objects
	this.minimumMilliseconds = 1000/this.targetFrameRate;
	
	//Thanks to Paul Irish for the requestAnimation code: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// shim layer with setTimeout fallback
	window.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       || 
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     || 
	          function( callback ){
	            window.setTimeout(callback, 1000 / this.targetFrameRate);
	          };
	})();
	

};

blastroids.GameEngine.prototype.start = function(){
	this.paused = false;
	this.runLoop();
};

blastroids.GameEngine.prototype.pause = function(){
	this.paused = true;
};

blastroids.GameEngine.prototype.runLoop = function(){
	
	var self = this;

	// check to see if the game is paused
	if(self.paused){
		return;
	}
	
	requestAnimationFrame(function(){
		self.runLoop();
	});
	
	/*
	var self = this;
	setTimeout(function(){
		self.runLoop();
	}, 1000/this.frameRate);
	*/


	var currentTime = +new Date,
		millisecondsSinceLastUpate = currentTime - self.lastUpdate;

	if(millisecondsSinceLastUpate > self.minimumMilliseconds){
		
		////////////////////////////////
		// draw the game objects here
		////////////////////////////////

	
		// calculate the current frame rate
		self.frameRate = 1000/millisecondsSinceLastUpate;
		
		self.lastUpdate = currentTime;
		
		if(self.onUpdate){
			self.onUpdate();
		}
	}

	

};


/*
function Ship(img){
	
	this.posX = 0;
	this.posY = 0;
	this.img = img;
	this.offsetX = img.width/2;
	this.offsetY = img.height/2;


}

Ship.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.posX - this.offsetX, this.posY - this.offsetY);
	ctx.drawImage(this.img,0,0);
	ctx.restore();
}
*/