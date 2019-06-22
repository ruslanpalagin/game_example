import React from 'react';
import './App.css';
import PIXI from "./vendor/PIXI";
import charUrl from "./textures/char.png";
import mountainsUrl from "./textures/mountains.png";
import treesUrl from "./textures/trees.png";
import keyMouseActions from "src/uiActionDecoders/keyMouseActions";
import uiActionGenerator from "src/uiActionGenerator/uiActionGenerator";
import viewCommander from "src/view/viewCommander";

const view = {};

class App extends React.Component {

    componentDidMount = () => {
        const app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: true, // default: false
            resolution: 1       // default: 1
        });
        view.app = app;
        app.renderer.resize(window.innerWidth - 50, window.innerHeight - 50 );
        document.getElementById("game__main-frame").appendChild(app.view);

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

            keyMouseActions.sub(window);
            app.ticker.add(() => {
                uiActionGenerator.loop(keyMouseActions, {char});
            });
            uiActionGenerator.on("newChar", (newV) => {
                viewCommander.draw(char, newV);
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
