package blasteroids;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.scene.CustomNode;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.Node;
import javafx.scene.transform.Rotate;

import blasteroids.Config;


//Note that public constants are declared outside of the class

//in JavaFX

public def NORMAL:Integer = 1;
public def SMALLER:Integer = 2;
public def SMALLEST:Integer = 3;

public class Asteroid extends CustomNode {

    public var type: Integer;
    public var img: Image;
    public var imgView: ImageView;
    public var posX: Number = 0;
    public var posY: Number = 0;
    public var offsetX: Number = bind posX - img.width / 2;
    public var offsetY: Number = bind posY - img.height / 2;
    public var faceAngle: Number=0;
    public var moveAngle: Number = 0;
    public var velocityX: Number=0;
    public var velocityY: Number=0;
    public var width: Number = bind img.width;
    public var height: Number = bind img.height;
    public var rotation_increment: Number = 0;
    public var active:Boolean = false;

    def timeline = Timeline{
        repeatCount: Timeline.INDEFINITE
        keyFrames: [
            KeyFrame{
                time: Config.REFRESH_RATE
                action: function():Void{
                    faceAngle += rotation_increment
                }
            }
        ]
    }

    override public function create():Node{
        timeline.play();
        var tempImg: Image;
        if(type == NORMAL){
            tempImg = Image{
                url: "{__DIR__}rock.png"
            };
        }else if (type == SMALLER){
            tempImg = Image{
                url: "{__DIR__}rock-smaller.png"
            };
        }else if (type == SMALLEST){
            tempImg = Image{
                url: "{__DIR__}rock-smallest.png"
            };
        }
        this.img = tempImg;
        this.imgView = ImageView{
            image: img
            x: bind offsetX
            y: bind offsetY
            transforms: Rotate {
                angle: bind faceAngle
                pivotX: bind posX
                pivotY: bind posY
            }
        }
        return imgView
    }
}