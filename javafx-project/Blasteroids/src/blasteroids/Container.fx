package blasteroids;

import blasteroids.Config;
import blasteroids.Ship;
import java.lang.Math;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.scene.CustomNode;
import javafx.scene.Group;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.Node;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import java.util.Random;

public class Container extends CustomNode {
    
    public var turnLeft:Boolean = false;
    public var turnRight:Boolean = false;

    public var ship: Ship = Ship{
        posX: Config.SCREEN_WIDTH / 2
        posY: Config.SCREEN_HEIGHT /2
    }
    public var txtInfo:Text = Text{
        x:10
        y:20
        wrappingWidth: Config.SCREEN_WIDTH - 20
        font: Font { size: 18 }
        fill: Color.WHITE
        //Just changing the text that was set in the last lesson...
        content:"Use the left and right arrow keys to turn the ship."
        "\nUse the up and down arrow keys to move the ship "
        "forward or reverse it."
        "\nPress the space key to fire bullets."
        "\nPress ENTER to start..."

    }
    var bullets: Bullet[];
    var currentBullet:Integer = 0;
    function initializeBullets():Void{
        //make sure the bullets sequence is empty before reloading...
        delete bullets;
        for(i in [1..Config.BULLET_COUNT]){
            var b=Bullet{};

            b.active = false;
            b.visible = false;
            //put the bullet onto the gameBoard,
            //even though it's not active yet...
            insert b into gameBoard.content;
            //put the bullet into the bullets sequence...
            insert b into bullets;
        }
    }
    var asteroids: Asteroid[];
    function initializeAsteroids():Void{
        for(i in [1..Config.ASTEROID_COUNT]){
            //NOTE:replace all the code that was previously in this
            //for loop with what you see here...
            //create random numbers to use for placing the asteroid
            //on the screen...
            var rand: Random = Random{};
            var x: Number = Math.abs(rand.nextInt()
                mod Config.SCREEN_WIDTH)+1;
            var y: Number = Math.abs(rand.nextInt()
                mod Config.SCREEN_HEIGHT)+1;
            //create the asteroid...
            var a = createAsteroid(x,y,Asteroid.NORMAL);
            //insert it into our asteroid sequence...
            insert a into asteroids;
            //put it on the scene...
            insert a before gameBoard.content[1];
        }

    }
    function createAsteroid(x:Number,y:Number,type:Integer):Asteroid{
        var rand: Random = Random{};
        //get a random number between 0-360 to set the
        //angle of movement of the asteroid...
        var moveAngle = Math.abs(rand.nextInt() mod 360) + 1;
        //get a random number to use as the velocity of the asteroid...
        var randomVelocity: Number = Math.abs(rand.nextInt()
            mod Config.ASTEROID_MAX_VELOCITY) + 1;
        //create a random rotation increment between 1 and 8...
        var rotation_increment = rand.nextInt() mod 8 + 1;
        //declare and initialize a new asteroid...
        var a: Asteroid = Asteroid{
            type: type
            posX: x
            posY: y
            moveAngle: moveAngle
            velocityX: Math.sin(Math.toRadians(moveAngle))
                * randomVelocity
            velocityY: -Math.cos(Math.toRadians(moveAngle))
                * randomVelocity
            rotation_increment: rotation_increment
            active: true;
        }
        return a;
    }
    public var gameBoard: Group = Group{
        content: [
            //background rectangle...
            Rectangle{
                width: Config.SCREEN_WIDTH;
                height: Config.SCREEN_HEIGHT;
                fill: Color.BLACK
            }
            //add the info text to the scene...
            txtInfo,
            //add the ship to the scene...
            ship
        ]
        focusTraversable:true
        //setting focusTraversable to true allows us to
        //listen for keyboard events
        onKeyPressed: function(e:KeyEvent):Void{
            if(e.code == KeyCode.VK_ENTER){
                if(not gameLoop.running or gameLoop.paused){
                    startGame();
                }
            }
            if(e.code == KeyCode.VK_LEFT){
                turnLeft = true;
            }
            if(e.code == KeyCode.VK_RIGHT){
                turnRight = true;
            }
            if(e.code == KeyCode.VK_UP){
                //when thrust is applied, make sure that it is applied
                //in the direction that the ship is FACING, so adjust
                //the moveAngle to equal the faceAngel...
                ship.moveAngle = ship.faceAngle;
                //increase the X velocity when the up arrow is pressed...
                ship.velocityX += Math.sin(Math.toRadians(ship.moveAngle))
                    * Config.SHIP_ACCELERATION;
                //increase the Y velocity when the up arrow is pressed...
                ship.velocityY += -Math .cos(Math.toRadians(ship.moveAngle))
                    * Config.SHIP_ACCELERATION;
            }
            if(e.code == KeyCode.VK_DOWN){
                ship.moveAngle = ship.faceAngle;
                //decrease the X velocity when the up arrow is pressed...
                ship.velocityX += Math.sin(Math.toRadians(ship.moveAngle))
                    * -Config.SHIP_ACCELERATION;
                //decrease the Y velocity when the up arrow is pressed...
                ship.velocityY += -Math .cos(Math.toRadians(ship.moveAngle))
                    * -Config.SHIP_ACCELERATION;
            }
            if(e.code == KeyCode.VK_SPACE){
                    //launch a bullet...
                    currentBullet++;
                    //if we reach the end of the bullets sequence, then
                    //we start recycling bullets...
                    if(currentBullet > Config.BULLET_COUNT - 1){
                        currentBullet = 0
                    }
                    //get a handle on the current bullet...
                    var b = bullets[currentBullet];
                    //make the bullet active...
                    b.active = true;

                   //make sure the bullet is visible...
                    b.visible = true;
                    //set the bullet's position to the position
                    //of the ship...
                    b.posX = ship.posX;
                    b.posY = ship.posY;
                    //set the bullet's move angle equal to the face angle
                    //of the ship...
                    b.moveAngle = ship.faceAngle;
                    //set the velocity of the bullet...
                    b.velocityX = Math.sin(Math.toRadians(b.moveAngle))
                        * Config.BULLET_VELOCITY;
                    b.velocityY = -Math .cos(Math.toRadians(b.moveAngle))
                        * Config.BULLET_VELOCITY;
            }
        }
        onKeyReleased:function(e:KeyEvent):Void{
           if(e.code == KeyCode.VK_LEFT){
                turnLeft = false;
            }
            if(e.code == KeyCode.VK_RIGHT){
                turnRight = false;
            }
        }
    }
    def gameLoop:Timeline = Timeline{
        repeatCount: Timeline.INDEFINITE
        keyFrames: [
            KeyFrame{
                time: Config.REFRESH_RATE
                action: function(){
                    gameUpdate();
                }
            }
        ]
    }
    public function startGame():Void{
        txtInfo.visible = false;
        initializeBullets();
        initializeAsteroids();
        gameLoop.play();
    }
    public function gameUpdate():Void{
        updateShip();
        updateBullets();
        updateAsteroids();
        collisionDetection();
    }
    public function collisionDetection():Void{
        //check for bullets colliding with asteriods...
        for(b in bullets){
            if(b.active){
                //for each 'active' bullet, loop through the active
                //asteriods and check for collision...
                for(a in asteroids){
                    if(a.active){
                        if(a.contains(b.posX, b.posY)){
                            //we have a hit, so make the asteroid disappear...
                            a.visible = false;
                            a.active = false;
                            //make the bullet disappear...
                            b.active = false;
                            b.visible = false;
                            //if it's a NORMAL asteroid, then split it
                            //into two smaller asteroids...
                            if(a.type == Asteroid.NORMAL){
                                splitAsteroid(a.posX,a.posY);
                            }
                        }
                    }
                }
            }
        }
        //use a boolean flag to determine if active asteroids
        //are remaining on the game board...
        var asteroidsRemain:Boolean = false;
        //check for ship colliding with asteroids...
        for(a in asteroids){
            if(a.active){
                asteroidsRemain = true;
                if(a.intersects(ship.offsetX, ship.offsetY, ship.width, ship.height)){
                    //the ship has collided with an asteroid,
                    //reset it to the middle of the screen...
                    ship.posX = Config.SCREEN_WIDTH / 2;
                    ship.posY = Config.SCREEN_HEIGHT / 2;
                    ship.velocityX =0;
                    ship.velocityY=0;
                }
            }
        }
        //if asteroidsRemain is false then the game is over....
        if(not asteroidsRemain){

            //no asteroids remain, so start the game over...
            startGame();
        }
    }
    public function splitAsteroid(x:Number, y:Number):Void{
        //create a SMALLER asteroid and a SMALLEST asteroid...
        var a1: Asteroid = createAsteroid(x,y,Asteroid.SMALLER);
        var a2: Asteroid = createAsteroid(x,y,Asteroid.SMALLEST);
        //add each one to the asteroids sequence...
        insert a1 into asteroids;
        insert a2 into asteroids;
        //add them to the scene...
        insert a1 before gameBoard.content[1];
        insert a2 before gameBoard.content[1];
    }
    public function updateAsteroids():Void{
        for(a in asteroids){
            if(a.active){
                //update the active asteroid's position...
                a.posX += a.velocityX;
                a.posY += a.velocityY;
                //handle wrapping for when the asteroid goes out of bounds...
                if(a.posX < 0 - a.width / 2 ) {
                    a.posX = Config.SCREEN_WIDTH;
                }
                if(a.posX > Config.SCREEN_WIDTH + a.width / 2) {
                    a.posX = 0;
                }
                if(a.posY < 0 - a.height / 2){
                    a.posY = Config.SCREEN_HEIGHT;
                }
                if(a.posY > Config.SCREEN_HEIGHT + a.height / 2 )
                {
                    a.posY = 0;
                }
            }
        }
    }
    public function updateBullets():Void{
        for(b in bullets){
            if(b.active){
                //update the active bullet's position...
                b.posX += b.velocityX;
                b.posY += b.velocityY;
                //if the bullet goes off the screen, set it to inactive...
                if(b.posX < 0 or b.posY > Config.SCREEN_WIDTH){
                    b.active = false;
                }
                if(b.posY < 0 or b.posY > Config.SCREEN_HEIGHT){
                    b.active = false;
                }
            }
        }
    }
    public function updateShip():Void{
        if(turnLeft){
            ship.faceAngle -=Config.SHIP_ROTATION_VELOCITY;
        }
        if(turnRight){
            ship.faceAngle +=Config.SHIP_ROTATION_VELOCITY;
        }
        //update the ship's position...
        ship.posX += ship.velocityX;
        ship.posY += ship.velocityY;

        //handle wrapping for when ship goes out of bounds...
        if(ship.posX < 0 - ship.width/2 ) {
            //ship has moved off the left side,
            //so make it wrap to the right side...
            ship.posX = Config.SCREEN_WIDTH;
        }
        if(ship.posX > Config.SCREEN_WIDTH + ship.width/2) {
            //ship has moved off the right side,
            //so make it wrap to the left side...
            ship.posX = 0;
        }
        if(ship.posY < 0 - ship.height/2){
            //ship has moved off the bottom of the scene,
            //so make it wrap to the top...
            ship.posY = Config.SCREEN_HEIGHT;
        }
        if(ship.posY > Config.SCREEN_HEIGHT + ship.height/2 )
        {
            //ship has moved off the top of the scene,
            //so make it wrap to the bottom...
            ship.posY = 0;
        }
    }
    override public function create():Node{
        return gameBoard;
    }
}
