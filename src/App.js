import React from 'react';
import PIXI from "./vendor/PIXI";
import keyMouseActions from "src/uiActionDecoders/keyMouseActions";
import uiActionGenerator from "src/uiActionGenerator/uiActionGenerator";
import View from "src/view/View";
import mapItems from "src/view/mapItems.js";
import WorldState from "src/state/WorldState.js";
import ServerConnection from "src/server/ServerConnection.js";

const worldState = new WorldState();
const serverConnection = new ServerConnection();
const view = new View();
const session = {
    accountId: 1,
};

class App extends React.Component {
    componentDidMount = () => {
        // init
        view.app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: true, // default: false
            resolution: 1       // default: 1
        });
        // view.app.renderer.resize(window.innerWidth - 50, window.innerHeight - 50 );
        document.getElementById("game__main-frame").appendChild(view.app.view);
        view.worldContainer = new PIXI.Container();
        view.app.stage.addChild(view.worldContainer);

        // connect to server & get world
        serverConnection.connect()
        .then(() => serverConnection.loadWorldState())
        .then((worldStateFromServer) => worldState.setState(worldStateFromServer))

        // load view
        .then(() => mapItems.loadSceneObjects(worldState.state.units))
        .then((sceneObjects) => view.addItems(sceneObjects))
        .then(() => {
            // control character & set it to the center of the view
            const controlledUnit = worldState.findUnit({accountId: session.accountId});
            view.trackCenter(controlledUnit);

            // bind keys & mouse
            keyMouseActions.sub(window);
            // // keyMouseActions.on("rotateCamera", ({rad}) => viewCommander.rotateCamera(view, rad));
            keyMouseActions.on("resize", () => view.resize());

            uiActionGenerator.on("moveUnit", (data) => serverConnection.toServer(session, "moveUnit", data));

            serverConnection.onMessageFromServer((session, action, data) => {
                // console.log("onMessageFromServer", session, action, data);
                if (action === "moveUnit") {
                    const updatedUnit = data;
                    const unit = worldState.updUnitById(updatedUnit.id, {position: updatedUnit.position, rotation: updatedUnit.rotation});
                    view.handleMoveUnit(unit);
                }
            });

            // // game view loop
            view.app.ticker.add(() => {
                uiActionGenerator.loop(keyMouseActions, {controlledUnit});
            });

            view.resize();
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
