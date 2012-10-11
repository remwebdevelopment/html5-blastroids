



var blastroids = {};

blastroids.GameEngine = function(settings){
	
	var self = this;

	// game settings
	self.canvas = settings.canvas;
	self.targetFrameRate = settings.targetFrameRate;
	self.onUpdate = settings.onUpdate || null;

	self.ctx = self.canvas.getContext("2d");
	self.stageWidth = self.canvas.width;
	self.stageHeight = self.canvas.height;

	

	// internal vars
	self.paused = true;
	self.lastUpdate = null;
	self.frameRate = null;

	// ship settings
	var shipImg = new Image();
	shipImg.src = "images/ship.png";
	self.ship = new blastroids.Ship(shipImg);
	self.ship.posX = self.stageWidth/2;
	self.ship.posY = self.stageHeight/2;
	self.shipRotation = 0; 
	self.shipRotationSpeed = 6;

	// in order to control the frame rate
	// we need to determine how many milliseconds
	// must elapse in order for us to update the game objects
	self.minimumMilliseconds = 1000/self.targetFrameRate;
	
	//Thanks to Paul Irish for the requestAnimation code: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// shim layer with setTimeout fallback
	window.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       || 
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     || 
	          function( callback ){
	            window.setTimeout(callback, 1000 / self.targetFrameRate);
	          };
	})();


	// add keyboard listeners for when a button is pressed and for when a button is released
	window.addEventListener('keydown', handleKeyboardPress, false);
	window.addEventListener('keyup', handleKeyboardRelease, false);
	
	function handleKeyboardPress(event){
		
		switch(event.keyCode){
			case 38: // up arrow
				console.log("apply thrust");
				break;
			case 39: // right arrow
				//console.log("turn right");
				self.shipRotation = 1;
				break;
			case 37: // left arrow
				//console.log("turn left");
				self.shipRotation = -1;
				break;
			case 32: // space bar
				console.log("fire!");
				break;
		}
	}

	function handleKeyboardRelease(event){
		
		switch(event.keyCode){
			case 38: // up arrow
				console.log("stop apply thrust");
				break;
			case 39,37: // right arrow
				//console.log("stop turn right");
				self.shipRotation = 0;
				break;
			/*
			case 37: // left arrow
				//console.log("stop turn left");
				self.shipRotation = 0;
				break;
			*/
			case 32: // space bar
				console.log("no need to handle release for fire!");
				break;
		}
	}
	

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
		self.ctx.clearRect(0, 0, self.stageWidth, self.stageHeight);
		self.ctx.setTransform(1,0,0,1,0,0);

		//console.log("rotation:" + this.shipRotation);
		if(this.shipRotation > 0){
			console.log("turn right");
			this.ship.faceAngle += self.shipRotationSpeed;
		}else if(this.shipRotation < 0){
			console.log("turn left");
			this.ship.faceAngle -= self.shipRotationSpeed;
		}

		this.ship.draw(this.ctx);

	
		// calculate the current frame rate
		self.frameRate = 1000/millisecondsSinceLastUpate;
		
		self.lastUpdate = currentTime;
		
		if(self.onUpdate){
			self.onUpdate();
		}
	}

	

};



blastroids.Ship = function(img){
	
	this.posX = 0;
	this.posY = 0;
	this.img = img;
	this.offsetX = img.width/2;
	this.offsetY = img.height/2;
	this.faceAngle = 0;
	//radians = degrees * Math.PI/180


};

blastroids.Ship.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.posX, this.posY);
	ctx.rotate(this.faceAngle * Math.PI/180);
	ctx.drawImage(this.img, -this.offsetX, -this.offsetY);
	ctx.restore();
};
