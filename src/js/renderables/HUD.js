import { GUI_Object, device, audio, game, Container, event, Vector2d, BitmapText } from 'melonjs/dist/melonjs.module.js'
import state from '../state.js';

/**
 * a basic control to toggle fullscreen on/off
 */
class FSControl extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: state.texture,
            region : "shadedDark30.png"
        });
        this.setOpacity(0.5);
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (!device.isFullscreen) {
            device.requestFullscreen();
        } else {
            device.exitFullscreen();
        }
        return false;
    }
};

/**
 * a basic control to toggle fullscreen on/off
 */
class AudioControl extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: state.texture,
            region : "shadedDark13.png" // ON by default
        });
        this.setOpacity(0.5);
        this.isMute = false;
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (this.isMute) {
            audio.unmuteAll();
            this.setRegion(state.texture.getRegion("shadedDark13.png"));
            this.isMute = false;
        } else {
            audio.muteAll();
            this.setRegion(state.texture.getRegion("shadedDark15.png"));
            this.isMute = true;
        }
        return false;
    }
};

/**
 * a basic HUD item to display score
 */
class ScoreItemImg extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y) {
        super(game.viewport.width + x, y, {
            image: state.texture,
            region : "cake.png"
        });
        this.anchorPoint.set(0, 0);
    }
};

class ScoreItemText extends BitmapText {
    /**
     * constructor
     */
    constructor(x, y) {
        console.log('W: ', game.viewport.width)
        console.log('H: ', game.viewport.height)
        // call the super constructor
        super(
            game.viewport.width  + x,
            y,
            {
                font : "PressStart2P",
                textAlign : "right",
                textBaseline : "bottom",
                text : "0"
            }
        );

        this.relative = new Vector2d(x, y);

        // local copy of the global score
        this.score = -1;

        // recalculate the object position if the canvas is resize
        event.on(event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(w, h, 0).add(this.relative);
        }).bind(this));
    }

    /**
     * update function
     */
    update( dt ) {
        if (this.score !== state.data.score) {
            this.score = state.data.score;
            this.setText(this.score);
            this.isDirty = true;
        }
        return super.update(dt);
    }
};

class LifeItemText extends BitmapText {
    /**
     * constructor
     */
    constructor(x, y) {
        console.log('W: ', game.viewport.width)
        console.log('H: ', game.viewport.height)
        // call the super constructor
        super(
            game.viewport.width  + x,
            y,
            {
                font : "PressStart2P",
                textAlign : "right",
                textBaseline : "bottom",
                text : "3"
            }
        );

        this.relative = new Vector2d(x, y);

        // local copy of the global score
        this.life = -1;

        // recalculate the object position if the canvas is resize
        event.on(event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(w, h, 0).add(this.relative);
        }).bind(this));
    }

    /**
     * update function
     */
    update( dt ) {
        if (this.life !== state.data.life) {
            this.life = state.data.life;
            this.setText(this.life);
            this.isDirty = true;
        }
        return super.update(dt);
    }
};

class LifeItemImg extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y) {
        super(game.viewport.width + x, y, {
            image: state.texture,
            region : "coin.png"
        });
        this.anchorPoint.set(0, 0);
    }
};


/**
 * a HUD container and child items
 */
class UIContainer extends Container {

    constructor() {
        // call the constructor
        super();

        // persistent across level change
        this.isPersistent = true;

        // Use screen coordinates
        this.floating = true;

        // make sure or object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        let scoreItemImg = this.addChild(new ScoreItemImg(-50, 5));
        let scoreItemText = this.addChild(new ScoreItemText(-60, 30));

        let lifeItemImg = this.addChild(new LifeItemImg(-50, 50));
        let lifeItemText = this.addChild(new LifeItemText(-60, 75))

        // add our audio control object
        this.addChild(new AudioControl(36, 56));

        if (!device.isMobile) {
            // add our fullscreen control object
            this.addChild(new FSControl(36 + 10 + 48, 56));
        }

        event.on(event.WINDOW_ONRESIZE, () =>  {
            // add our child score object at position
            this.removeChildNow(scoreItemImg, true);
            scoreItemImg = this.addChild(new ScoreItemImg(-50, 5));
            this.removeChildNow(scoreItemText, true);
            scoreItemText = this.addChild(new ScoreItemText(-60, 30));

            // add out child life object at position
            this.removeChildNow(lifeItemImg, true);
            lifeItemImg = this.addChild(new LifeItemImg(-50, 50));;
            this.removeChildNow(lifeItemText, true)
            lifeItemText = this.addChild(new LifeItemText(-60, 75))
        })
    }
}

export default UIContainer;
