import * as me from 'melonjs/dist/melonjs.module.js';

// a basic progress bar object
class ProgressBar extends me.Renderable {
    /**
     * @ignore
     */
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.barHeight = h;
        this.anchorPoint.set(0, 0);

        me.event.on(me.event.LOADER_PROGRESS, this.onProgressUpdate, this);
        me.event.on(me.event.VIEWPORT_ONRESIZE, this.resize, this);

        this.anchorPoint.set(0, 0);

        // store current progress
        this.progress = 0;
    }

    /**
     * make sure the screen is refreshed every frame
     * @ignore
     */
    onProgressUpdate(progress) {
        this.progress = ~~(progress * this.width);
        this.isDirty = true;
    }

    /**
     * draw function
     * @ignore
     */
    draw (renderer) {
        // draw the progress bar
        renderer.setColor("#d0f4f7");
        renderer.fillRect(this.pos.x, me.game.viewport.centerY, renderer.getWidth(), this.barHeight / 2);

        renderer.setColor("black");
        renderer.fillRect(this.pos.x, me.game.viewport.centerY, this.progress, this.barHeight / 2);
    }

    /**
     * Called by engine before deleting the object
     * @ignore
     */
    onDestroyEvent() {
        // cancel the callback
        me.event.off(me.event.LOADER_PROGRESS, this.onProgressUpdate);
        me.event.off(me.event.VIEWPORT_ONRESIZE, this.resize);
    }

};

/**
 * a default loading screen
 * @ignore
 */
class LoadingScreen extends me.Stage {
    /**
     * call when the loader is resetted
     * @ignore
     */
    onResetEvent() {
        var barHeight = 8;

        // set a background color
        me.game.world.backgroundColor.parseCSS("#fff");

        // progress bar
        me.game.world.addChild(new ProgressBar(
            0,
            me.video.renderer.getHeight() / 2,
            me.video.renderer.getWidth(),
            barHeight
        ), 1);

        var logo1 = me.pool.pull("Text",
            me.video.renderer.getWidth() / 2,
            (me.video.renderer.getHeight() / 2) + 16, {
                font: "century gothic",
                size: 32,
                fillStyle: "black",
                textAlign: "left",
                textBaseline : "top",
                text: "Загрузка ...",
                offScreenCanvas: me.video.renderer.WebGLVersion >= 1
            }
        );
        logo1.anchorPoint.set(0, 0);

        /*
        var logo2 = me.pool.pull("Text",
            me.video.renderer.getWidth() / 2,
            (me.video.renderer.getHeight() / 2) + 16, {
                font: "century gothic",
                size: 32,
                fillStyle: "#55aa00",
                textAlign: "left",
                textBaseline : "top",
                bold: true,
                text: "world",
                offScreenCanvas: me.video.renderer.WebGLVersion >= 1
            }
        );
        logo2.anchorPoint.set(0, 0);
         */

        // adjust position of both text
        var text_width = logo1.getBounds().width;
        logo1.pos.x = me.video.renderer.getWidth() / 2 - text_width / 2;
        //logo2.pos.x = logo1.pos.x + logo1.getBounds().width;

        // melonJS text
        me.game.world.addChild(logo1, 2);
        //me.game.world.addChild(logo2, 2);
    }
};

export default LoadingScreen;
