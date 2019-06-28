import React from 'react';
import PIXI from "./vendor/PIXI";
import View from "src/view/View";
import WorldState from "src/state/WorldState.js";
import ServerConnection from "src/server/ServerConnection.js";
import keyMouseActions from "src/uiActionDecoders/keyMouseActions.js";

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
        .then(() => view.loadAndAddItems(worldState.state.units))
        .then(() => {
            // bind keys & mouse
            keyMouseActions.sub(window);

            // control character & set it to the center of the view
            const controlledUnit = worldState.findUnit({accountId: session.accountId});
            view.setControlledUnit(controlledUnit);
            view.listenToInput(keyMouseActions);
            view.uiActionGenerator.on("moveUnit", (data) => serverConnection.toServer(session, "moveUnit", data));

            serverConnection.onMessageFromServer((session, action, data) => {
                // console.log("onMessageFromServer", session, action, data);
                if (action === "moveUnit") {
                    const updatedUnit = data;
                    const unit = worldState.updUnitById(updatedUnit.id, {position: updatedUnit.position, rotation: updatedUnit.rotation});
                    view.handleMoveUnit(unit);
                }
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
