import { Stage, game, ColorLayer } from 'melonjs/dist/melonjs.module.js';

class TitleScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        game.world.addChild(new ColorLayer("background", "#fefe"))
    }

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent() {
        ; // TODO
    }
};

export default TitleScreen;
