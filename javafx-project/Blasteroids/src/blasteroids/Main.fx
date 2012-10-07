package blasteroids;

import javafx.stage.Stage;
import javafx.scene.Scene;

Stage {
    title: "BLASTEROIDS"
    width: Config.SCREEN_WIDTH
    height: Config.SCREEN_HEIGHT;
    resizable: false
    onClose: function(){
        java.lang.System.exit(0);
    }
    scene: Scene {
        content: [
            Container{}
        ]
    }
}