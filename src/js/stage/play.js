import { Stage, level, audio, game, device, plugins} from 'melonjs/dist/melonjs.module.js'

import state from '../state.js';
import VirtualJoypad from '../renderables/controls.js';
import UIContainer from '../renderables/HUD.js';

class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
      // load a level
        level.load("map1");

        // reset the score
        state.data.score = 0;
        state.data.life = 3;

        // add our HUD to the state world
        if (typeof this.HUD === "undefined") {
            this.HUD = new UIContainer();
        }
        game.world.addChild(this.HUD);

        // display if debugPanel is enabled or on mobile
        if ((plugins.debugPanel && plugins.debugPanel.panel.visible) || device.touch) {
            if (typeof this.virtualJoypad === "undefined") {
                this.virtualJoypad = new VirtualJoypad();
            }
            game.world.addChild(this.virtualJoypad);
        }

        // play some music
        //audio.playTrack("dst-gameforest");
    }

    /**
     *  action to perform on state change
     */
    onDestroyEvent() {

        // remove the HUD from the state world
        game.world.removeChild(this.HUD);

        // remove the joypad if initially added
        if (this.virtualJoypad && game.world.hasChild(this.virtualJoypad)) {
            game.world.removeChild(this.virtualJoypad);
        }

        // stop some music
        //audio.stopTrack("dst-gameforest");
    }
};

export default PlayScreen;
