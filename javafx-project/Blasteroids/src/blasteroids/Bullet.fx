package blasteroids;

import javafx.scene.CustomNode;
import javafx.scene.Node;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;

public class Bullet extends CustomNode {

    public var posX: Number;
    public var posY: Number;
    public var offsetX: Number = bind posX - rectangle.width / 2;
    public var offsetY: Number = bind posY - rectangle.height / 2;
    public var active: Boolean = false;
    public var moveAngle: Number;
    public var velocityX: Number;
    public var velocityY: Number;

    var rectangle:Rectangle = Rectangle{
        width: 3
        height: 3
        fill: Color.BLUE;
        translateX: bind offsetX;
        translateY: bind offsetY;
    }

    override public function create():Node{
        return rectangle;
    }

}