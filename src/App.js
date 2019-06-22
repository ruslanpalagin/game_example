import React from 'react';
import './App.css';
import PIXI from "./vendor/PIXI";
import keyMouseActions from "src/uiActionDecoders/keyMouseActions";
import uiActionGenerator from "src/uiActionGenerator/uiActionGenerator";
import viewCommander from "src/view/viewCommander";
import mapItems from "src/view/mapItems.js";

const view = {};
window.view = view;

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

        mapItems.load().then(({char, items}) => {
            view.worldContainer = new PIXI.Container();
            items.forEach(item => view.worldContainer.addChild(item));

            view.char = char;
            view.char.anchor.x = 0.5;
            view.char.anchor.y = 0.5;
            view.worldContainer.addChild(char);

            app.stage.addChild(view.worldContainer);

            keyMouseActions.sub(window);
            keyMouseActions.on("rotateCamera", ({rad}) => viewCommander.rotateCamera(view, rad));
            keyMouseActions.on("resize", () => viewCommander.resize(view));

            app.ticker.add(() => {
                uiActionGenerator.loop(keyMouseActions, view);
            });

            uiActionGenerator.on("newChar", (newV) => {
                viewCommander.drawChar(view, newV);
            });

            uiActionGenerator.emit("newChar", { position: {x: 0, y: -550 }, rotation: 0.5 });
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
