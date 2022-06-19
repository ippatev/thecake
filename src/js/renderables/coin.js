import { game, audio, Collectable, Ellipse, collision } from 'melonjs/dist/melonjs.module.js';
import state from '../state.js';

class CoinEntity extends Collectable {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        // call the super constructor
        super(x, y,
            Object.assign({
                image: state.texture,
                region : "cake.png",
                shapes :[new Ellipse(32 / 2, 32 / 2, 32, 32)] // coins are 35x35
            })
        );
    }

    // add a onResetEvent to enable object recycling
    onResetEvent(x, y, settings) {
        this.shift(x, y);
        // only check for collision against player
        this.body.setCollisionMask(collision.types.PLAYER_OBJECT);
    }

    /**
     * collision handling
     */
    onCollision(/*response*/) {
        if(state.data.score >= 5) {
            // me.stae.change(me.state.PAUSE)
        }


        // do something when collide
        audio.play("cling", false);
        // give some score
        state.data.score += 1;

        //avoid further collision and delete it
        this.body.setCollisionMask(collision.types.NO_OBJECT);

        game.world.removeChild(this);

        return false;
    }
};

export default CoinEntity;
