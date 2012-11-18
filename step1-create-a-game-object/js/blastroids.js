
/*

//THE VERSION BELOW THIS ONE USES A REAL MODULE PATTERN
// THE ONE BELOW THAT VERSION HAS CODE FOR FRAME RATES

var blastroids = {};

blastroids.gameEngine = function(settings){
	var canvas = settings.canvas,
		ctx = canvas.getContext("2d"),
		stageHeight = canvas.height,
		stageWidth = canvas.width;


	var shipImg = new Image();
	shipImg.src = "images/ship.png";

	var ship = blastroids.gameObject(shipImg);
	ship.posX = stageWidth/2;
	ship.posY = stageHeight/2;
	
	function start(){
		ship.draw(ctx);
	};

	function pause(){
		alert("TODO: implement pause()");
	}

	return {
		start: 	start,
		pause: 	pause
	}

};


//Note that we are using the 'Revealing Module' pattern - see page 99 of stoyan book
// - not really, the module pattern using an IEFE
blastroids.gameObject = function(img){
	
	var img = img,
		posX = 0,
		posY = 0,
		offsetX = -img.width/2,
		offsetY = -img.height/2;

	function draw(ctx){
		ctx.save();
		ctx.translate(this.posX, this.posY);
		ctx.drawImage(img, offsetX, offsetY);
		
		// If you don't use the offset, you'll notice that the ship is positioned with it's
		// top left corner at the center of the stage
		//ctx.drawImage(img, 0, 0); 
		
		ctx.restore();
	}

	return {
		img: 		img,
		posX: 		posX,
		posY: 		posY,
		draw: 		draw  
	};

	
};
*/

var blastroids = {};

/*it might be sort of helpful to stub out the GameEngine before filling in the code*/
blastroids.createGameEngine = function(settings){
	
	// PRIVATE PROPERTIES
	var canvas = settings.canvas,
		ctx = canvas.getContext("2d"),
		stageHeight = canvas.height,
		stageWidth = canvas.width,
		ship;

	// PUBLIC PROPERTIES
	// TODO: we'll add some in the coming lessons

	// SHIP SET UP
	// get it's image first
	var shipImg = new Image();
	shipImg.src = "images/ship.png";
	// create the ship and position it in the middle of the stage 
	ship = new blastroids.GameObject(shipImg);
	ship.posX = stageWidth/2;
	ship.posY = stageHeight/2;

	// RETURN THE PUBLIC API OBJECT
	return {
		start: 	start,
		pause: 	pause 
	};

	
	// PUBLIC METHODS
	// note that public methods do get returned in the public api object
	function start(){
		// for now, start() will call _draw(), which draws all the objects on the stage
		// but in the next lesson, we'll add an animation loop that calls _draw()
		_draw(ctx);
	}
		
	function pause(){
		alert("TODO: implement pause in the next lesson");
	}

	// PRIVATE METHODS 
	// note that they are prefixed with and underscore
	// and that they don't get returned in the public api object
	
	function _draw(ctx){
		// the _draw() method renders all of our game objects on the stage
		// for now we just have single object (our ship)
		ship.draw(ctx);
	}
}


/*
blastroids.GameEngine = (function(){

	// private properties
	var canvas,
		ctx,
		stageHeight,
		stageWidth,
		ship;
	

	function init(settings){
		canvas = settings.canvas,
		ctx = canvas.getContext("2d"),
		stageHeight = canvas.height,
		stageWidth = canvas.width;

		var shipImg = new Image();
			shipImg.src = "images/ship.png";

		ship = new blastroids.GameObject(shipImg);
		ship.posX = stageWidth/2;
		ship.posY = stageHeight/2;

		// return public api
		return {
			start: 	start,
			pause: 	pause 
		};
	}

	return {init: init};

	function start(){
		ship.draw(ctx);
	}

	function pause(){
		alert("TODO: implement pause in the next lesson");
	}

	

})();

*/

/*
blastroids.GameEngine = function(settings){
	
	this.canvas = settings.canvas,
	this.ctx = this.canvas.getContext("2d"),
	this.stageHeight = this.canvas.height,
	this.stageWidth = this.canvas.width;

	var shipImg = new Image();
		shipImg.src = "images/ship.png";

	this.ship = new blastroids.GameObject(shipImg);
	this.ship.posX = this.stageWidth/2;
	this.ship.posY = this.stageHeight/2;
};

blastroids.GameEngine.prototype.start = function(){
	this.ship.draw(this.ctx);
};

blastroids.GameEngine.prototype.pause = function(){
	alert("TODO: we'll implement pause() in the next lesson");
};
*/

/*
blastroids.GameEngine = (function(){
	// imports (modules/classes that are used in this class)
	//var GameObject = blastroids.GameObject;

	// private properties and methods
	var canvas,
		ctx,
		stageWidth,
		stageHeight,
		ship,
		shipImg;

	// public api
	var Constr = function(settings){
		
		canvas = settings.canvas,
		ctx = canvas.getContext("2d"),
		stageHeight = canvas.height,
		stageWidth = canvas.width;

		shipImg = new Image();
		shipImg.src = "images/ship.png";

		ship = new blastroids.GameObject(shipImg);
		ship.posX = stageWidth/2;
		ship.posY = stageHeight/2;
	};

	
	Constr.prototype.start = function(){
		ship.draw(ctx);
	};

	Constr.prototype.pause = function(){
		alert("TODO: implement pause()");
	};
	
	return Constr;

})();
*/

blastroids.GameObject = function(img){
	
	this.posX = 0;
	this.posY = 0;
	this.img = img;
	this.width = img.width;
	this.height = img.height;
	this.offsetX = -this.width/2;
	this.offsetY = -this.height/2;


};

blastroids.GameObject.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.posX, this.posY);
	ctx.drawImage(this.img, this.offsetX, this.offsetY);
	ctx.restore();
};



/*
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
	
	
	//var self = this;
	//setTimeout(function(){
	//	self.runLoop();
	//}, 1000/this.frameRate);
	


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