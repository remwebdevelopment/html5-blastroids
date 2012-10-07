package blasteroids;

import javafx.scene.CustomNode;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.Node;

import javafx.scene.transform.Rotate;

public class Ship extends CustomNode {
    public var posX:Number = 0;
    public var posY:Number = 0;
    public var offsetX:Number = bind posX - img.width/2;
    public var offsetY:Number = bind posY - img.height/2;
    public var faceAngle: Number=0;
    public var moveAngle: Number = 0;
    public var velocityX: Number=0;
    public var velocityY: Number=0;
    public var width:Number = bind img.width;
    public var height:Number = bind img.height;

    var img = Image{
        url: "{__DIR__}ship.png"

        //there is a link to download this image below

        //just copy it to the same directory as your class files
    }

    var imgView = ImageView{
        image: img
        x: bind offsetX
        y: bind offsetY
        transforms: Rotate {
            angle: bind faceAngle
            pivotX: bind posX
            pivotY: bind posY
        }
    }

    override public function create():Node{
        return imgView
    }
}
