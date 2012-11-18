


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
		shipRotationSpeed = 6,
		// NEW
		shipAcceleration = 1;
		// END NEW

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
			// NEW
			case 38: // up arrow
				console.log("arrow up");
				//when thrust is applied, make sure that it is applied
                //in the direction that the ship is FACING, so adjust
                //the moveAngle to equal the faceAngel...
                ship.moveAngle = ship.faceAngle;
                //increase the X velocity when the up arrow is pressed...
                ship.velocityX += Math.sin(ship.moveAngle * (Math.PI / 180)) // MENTION THAT MATH.PI / 180 CONVERTS DEGREES TO RADIANS
                    * shipAcceleration;
                //increase the Y velocity when the up arrow is pressed...
                ship.velocityY += -Math.cos(ship.moveAngle * (Math.PI / 180))
                    * shipAcceleration;
				break;
			case 40: // down arrow
				ship.moveAngle = ship.faceAngle;
                //decrease the X velocity when the up arrow is pressed...
                ship.velocityX += Math.sin(ship.moveAngle * (Math.PI / 180))
                    * -shipAcceleration;
                //decrease the Y velocity when the up arrow is pressed...
                ship.velocityY += -Math.cos(ship.moveAngle * (Math.PI / 180))
                    * -shipAcceleration;
				break;
			// END NEW
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
	
	// RETURN THE PUBLIC API OBJECT
	return {
		start: 			start,
		pause: 			pause,
		getFrameRate: 	getFrameRate  	
	};

	
	// PUBLIC METHODS
	// note that public methods do get returned in the public api object
	function start(){
		paused = false;
		_runLoop();
	}
		
	function pause(){
		paused = true;
	}

	// PRIVATE METHODS 
	// note that they are prefixed with and underscore
	// and that they don't get returned in the public api object
	
	function _draw(ctx){
		
		// the _draw() method renders all of our game objects on the stage
		// for now we just have single object (our ship)
		
		// clear the canvas before redrawing
		ctx.clearRect(0, 0, stageWidth, stageHeight);
		ctx.setTransform(1,0,0,1,0,0);
		// recalculate the ship's properties before drawing it
		_updateShip();		
		ship.draw(ctx);

	}

	function _updateShip(){
		//console.log("rotation:" + shipRotation);
		if(shipRotation > 0){
			//console.log("turn right");
			ship.faceAngle += shipRotationSpeed;
		}else if(shipRotation < 0){
			//console.log("turn left");
			ship.faceAngle -= shipRotationSpeed;
		}

		// NEW
		//update the ship's position...
        ship.posX += ship.velocityX;
        ship.posY += ship.velocityY;

        //handle wrapping for when ship goes out of bounds...
        if(ship.posX < 0 - ship.width/2 ) {
            //ship has moved off the left side,
            //so make it wrap to the right side...
            ship.posX = stageWidth;
        }
        if(ship.posX > stageWidth + ship.width/2) {
            console.log("ship has moved off the right side.......");
            //ship has moved off the right side,
            //so make it wrap to the left side...
            ship.posX = 0;
        }
        if(ship.posY < 0 - ship.height/2){
            //ship has moved off the top of the scene,
            //so make it wrap to the bottom...
            ship.posY = stageHeight;
        }
        if(ship.posY > stageHeight + ship.height/2 )
        {
            //ship has moved off the bottom of the scene,
            //so make it wrap to the top...
            ship.posY = 0;
        }
		// END NEW
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
};


blastroids.GameObject = function(img){
	
	this.posX = 0;
	this.posY = 0;
	this.img = img;
	this.width = img.width;
	this.height = img.height;
	this.offsetX = -this.width/2;
	this.offsetY = -this.height/2;
	this.faceAngle = 0;
	// NEW
	this.moveAngle = 0;
	this.velocityX = 0;
	this.velocityY = 0;
	// END NEW


};

blastroids.GameObject.prototype.draw = function(ctx){
	ctx.save();
	ctx.translate(this.posX, this.posY);
	ctx.rotate(this.faceAngle * Math.PI/180);
	ctx.drawImage(this.img, this.offsetX, this.offsetY);
	ctx.restore();
};

