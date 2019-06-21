import React from 'react';
import './App.css';
import PIXI from "./vendor/PIXI";
import charUrl from "./textures/char.png";
import mountainsUrl from "./textures/mountains.png";
import treesUrl from "./textures/trees.png";

class App extends React.Component {

    componentDidMount = () => {
        const app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: true, // default: false
            resolution: 1       // default: 1
        });
        app.renderer.resize(window.innerWidth - 50, window.innerHeight - 50 );
        document.getElementById("game__main-frame").appendChild(app.view);

        // app.ticker.add(delta => gameLoop(delta));

        PIXI.loader = new PIXI.Loader();
        PIXI.loader
        .add([
            charUrl,
            mountainsUrl,
            treesUrl,
        ])
        .on("progress", (loader, resource) => {
            //Display the file `url` currently being loaded
            console.log("loading: " + resource.url);
            //Display the percentage of files currently loaded
            console.log("progress: " + loader.progress + "%");
            //If you gave your files names as the first argument
            //of the `add` method, you can access them like this
            //console.log("loading: " + resource.name);
        })
        .load(() => {
            let m = new PIXI.Sprite(PIXI.loader.resources[mountainsUrl].texture);
            m.position.y = 100;
            app.stage.addChild(m);

            let t = new PIXI.Sprite(PIXI.loader.resources[treesUrl].texture);
            t.position.x = 100;
            app.stage.addChild(t);

            let char = new PIXI.Sprite(PIXI.loader.resources[charUrl].texture);
            char.anchor.x = 0.5;
            char.anchor.y = 0.5;
            char.position.set(110, 110);
            app.stage.addChild(char);

            document.addEventListener('keydown', (key) => {
                // W Key is 87
                // Up arrow is 87
                if (key.keyCode === 87 || key.keyCode === 38) {
                    char.position.x += Math.sin(char.rotation) * 10;
                    char.position.y -= Math.cos(char.rotation) * 10;
                }

                // S Key is 83
                // Down arrow is 40
                if (key.keyCode === 83 || key.keyCode === 40) {
                    char.position.x -= Math.sin(char.rotation) * 10;
                    char.position.y += Math.cos(char.rotation) * 10;
                }

                // A Key is 65
                // Left arrow is 37
                if (key.keyCode === 65 || key.keyCode === 37) {
                    char.position.x -= Math.cos(char.rotation) * 10;
                    char.position.y -= Math.sin(char.rotation) * 10;
                }

                // D Key is 68
                // Right arrow is 39
                if (key.keyCode === 68 || key.keyCode === 39) {
                    char.position.x += Math.cos(char.rotation) * 10;
                    char.position.y += Math.sin(char.rotation) * 10;
                }

                // q
                if (key.keyCode === 81) {
                    char.rotation -= Math.PI / 10;
                }

                // e
                if (key.keyCode === 69) {
                    char.rotation += Math.PI / 10;
                }
                console.log("key.keyCode", key.keyCode);
            });


        });
    }

    render = () => {
        return (
            <div className="">
                <div className="game__main-frame" id="game__main-frame" />
            </div>
        );
    };
}

export default App;
