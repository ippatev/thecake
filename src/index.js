import {
    event,
    audio,
    loader,
    state as meState,
    device,
    video,
    utils,
    plugin,
    pool,
    TextureAtlas, input
} from 'melonjs/dist/melonjs.module.js';

import state from 'js/state'

import 'index.css';

import ReadyScreen from 'js/stage/ready.js';
import PlayScreen from 'js/stage/play.js';
import LoadingScreen from 'js/stage/loading.js'

import PlayerEntity from 'js/renderables/player.js';

import DataManifest from 'manifest.js';
import {FlyEnemyEntity, SlimeEnemyEntity} from "./js/renderables/enemies";
import CoinEntity from "./js/renderables/coin";
import axios from "axios";


device.onReady(() => {
    // initialize the display canvas once the device/browser is ready
    if (!video.init(800, 600, {parent : "screen", scaleMethod: "flex-width", renderer: video.AUTO, preferWebGL1: false})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // initialize the debug plugin in development mode.
    if (process.env.NODE_ENV === 'development') {
        import('js/plugin/debug/debugPanel.js').then((debugPlugin) => {
            // automatically register the debug panel
            utils.function.defer(plugin.register, this, debugPlugin.DebugPanelPlugin, "debugPanel");
        });

    }

    // Initialize the audio.
    audio.init("mp3,ogg");

    // Set custom loading screen
    meState.set(meState.LOADING, new LoadingScreen())

    // allow cross-origin for image/texture loading
    loader.crossOrigin = "anonymous";

    // set and load all resources.
    loader.preload(DataManifest, function() {
        // set the user defined state stages
        meState.set(meState.READY, new ReadyScreen());
        meState.set(meState.PLAY, new PlayScreen());

        // add our player entity in the entity pool
        pool.register("mainPlayer", PlayerEntity);
        pool.register("SlimeEntity", SlimeEnemyEntity);
        pool.register("FlyEntity", FlyEnemyEntity);
        pool.register("CoinEntity", CoinEntity, true);

        state.texture = new TextureAtlas(loader.getJSON("texture"), loader.getImage("texture"))

        event.on(event.KEYDOWN, (action, keyCode) => {
            // change global volume setting
            if (keyCode === input.KEY.PLUS) {
                // increase volume
                audio.setVolume(audio.getVolume()+0.1);
            } else if (keyCode === input.KEY.MINUS) {
                // decrease volume
                audio.setVolume(audio.getVolume()-0.1);
            }

            // toggle fullscreen on/off
            if (keyCode === input.KEY.F) {
                if (!device.isFullscreen) {
                    device.requestFullscreen();
                } else {
                    device.exitFullscreen();
                }
            }

            if(keyCode === input.KEY.Q) {
                axios.get('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
                   console.log('GET -> ', res.data)
                }).catch((err) => new Error(err))
            }
        })

        if(device.isPortrait()) {
            console.log('isPortrait')
            meState.change(meState.READY)
        } else {
            // switch to PLAY state
            meState.change(meState.PLAY);
        }

        event.on(event.WINDOW_ONRESIZE, (event) =>  {
            if(device.isLandscape()) {
                // switch to PLAY state
                meState.change(meState.PLAY);
            }
        })
    });
});
