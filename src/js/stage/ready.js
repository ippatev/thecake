import {Stage, game, ColorLayer, BitmapText, video, Renderable, Text} from 'melonjs/dist/melonjs.module.js';

class ReadyScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        game.world.addChild(new ColorLayer("background", "#d0f4f7"))

        this.font = new Text(game.viewport.width / 2, game.viewport.height / 2, {
            font : "PressStart2P",
            size: 32,
            textAlign : "center",
            textBaseline : "bottom",
            text: 'Переверните экран',
            fillStyle: "#000"
        })

        game.world.addChild(this.font)
    }

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent() {
        ; // TODO
    }
};

export default ReadyScreen;
