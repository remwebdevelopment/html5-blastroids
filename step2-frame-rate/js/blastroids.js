


var blastroids = {};

/*it might be sort of helpful to stub out the GameEngine before filling in the code*/
blastroids.createGameEngine = function(settings){
	
	// PRIVATE PROPERTIES
	var canvas = settings.canvas,
		ctx = canvas.getContext("2d"),
		stageHeight = canvas.height,
		stageWidth = canvas.width,
		ship,
		// NEW VARS
		minimumMilliseconds,
		targetFrameRate = settings.targetFrameRate || 30,
		paused = true,
		frameRate,
		lastUpdate = +new Date;
		onUpdate = settings.onUpdate,
		shipRotation = 0,
		shipRotationSpeed = 6;

	// PUBLIC PROPERTIES
	// TODO: we'll add some in the coming lessons

	// SHIP SET UP
	// get it's image first
	var shipImg = new Image();
	shipImg.src = "images/ship.png";
	shipImg.addEventListener('load', function(){
		// when the ship image loads, create the ship and position it in the middle of the stage 
		ship = new blastroids.GameObject(shipImg);
		ship.posX = stageWidth/2;
		ship.posY = stageHeight/2;
	}, false);
		


	// NEW 
	// in order to control the frame rate
	// we need to determine how many milliseconds
	// must elapse in before we update the game objects
	minimumMilliseconds = 1000/targetFrameRate;
	
	//Thanks to Paul Irish for the requestAnimation code: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// shim layer with setTimeout fallback
	window.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       || 
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     || 
	          function( callback ){
	            window.setTimeout(callback, 1000 / targetFrameRate);
	          };
	})();

	// add keyboard listeners for when a button is pressed and for when a button is released
	window.addEventListener('keydown', handleKeyboardPress, false);
	window.addEventListener('keyup', handleKeyboardRelease, false);
	
	function handleKeyboardPress(event){
		
		// check to see if the game is paused
		if(paused){
			return;
		}

		switch(event.keyCode){
			
			case 39: // right arrow
				//console.log("turn right");
				shipRotation = 1;
				break;
			case 37: // left arrow
				//console.log("turn left");
				shipRotation = -1;
				break;
			
		}
	}

	function handleKeyboardRelease(event){
		
		// check to see if the game is paused
		if(paused){
			return;
		}

		switch(event.keyCode){
			case 37: // left arrow
				//console.log("stop turn");
				shipRotation = 0;
				break;
			case 39: // right arrow
				//console.log("stop turn left");
				shipRotation = 0;
				break;
		}
	}
	// NEW END

	// RETURN THE PUBLIC API OBJECT
	return {
		start: 			start,
		pause: 			pause,
		// NEW
		getFrameRate: 	getFrameRate  	
	};

	
	// PUBLIC METHODS
	// note that public methods do get returned in the public api object
	function start(){
		/* REMOVED THIS CODE FROM STEP ONE (replace it with the code below)
		// for now, start() will call _draw(), which draws all the objects on the stage
		// but in the next lesson, we'll add an animation loop that calls _draw()
		_draw(ctx);
		*/
		paused = false;
		_runLoop();
	}
		
	function pause(){
		//REMOVED
		//alert("TODO: implement pause in the next lesson");
		
		paused = true;
	}

	// PRIVATE METHODS 
	// note that they are prefixed with and underscore
	// and that they don't get returned in the public api object
	
	function _draw(ctx){
		
		// the _draw() method renders all of our game objects on the stage
		// for now we just have single object (our ship)
		
		// NEW
		// clear the canvas before redrawing
		ctx.clearRect(0, 0, stageWidth, stageHeight);
		ctx.setTransform(1,0,0,1,0,0);
		// recalculate the ship's properties before drawing it
		_updateShip(); // NOTE THAT THERE WILL EVENTUALLY BE QUITE A BIT OF CODE RELATED TO POSITIONING THE SHIP BEFORE CALLING IT'S draw() METHOD, SO LETS MOVE THE CODE INTO _updateShip()
		// NEW END

		ship.draw(ctx);

	}

	// NEW
	function _updateShip(){
		//console.log("rotation:" + shipRotation);
		if(shipRotation > 0){
			//console.log("turn right");
			ship.faceAngle += shipRotationSpeed;
		}else if(shipRotation < 0){
			//console.log("turn left");
			ship.faceAngle -= shipRotationSpeed;
		}
	}

	function _runLoop(){
		
		// check to see if the game is paused
		if(paused){
			return;
		}
		
		requestAnimationFrame(function(){
			_runLoop();
		});

		var currentTime = +new Date,
			millisecondsSinceLastUpate = currentTime - lastUpdate;

		if(millisecondsSinceLastUpate > minimumMilliseconds){
			
			////////////////////////////////
			// draw the game objects here
			////////////////////////////////
			_draw(ctx);
		
			// calculate the current frame rate
			frameRate = 1000/millisecondsSinceLastUpate;
			
			lastUpdate = currentTime;
			
			if(onUpdate){
				onUpdate();
			}
		}
	}

	function getFrameRate(){
		return frameRate;
	}
	// NEW END


};


blastroids.GameObject = function(img){
	
	this.posX = 0;
	this.posY = 0;
	this.img = img;
	this.width = img.width;
	this.height = img.height;
	this.offsetX = -this.width/2;
	this.offsetY = -this.height/2;
	// NEW 
	this.faceAngle = 0;


};

blastroids.GameObject.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.posX, this.posY);
	// NEW
	ctx.rotate(this.faceAngle * Math.PI/180);
	// NEW END
	ctx.drawImage(this.img, this.offsetX, this.offsetY);
	ctx.restore();
};

