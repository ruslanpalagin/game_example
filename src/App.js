import React from 'react';
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
        view.createCanvas(document, { elId: "game__main-frame" });

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

            // send data to server
            view.uiActionGenerator.on("moveUnit", (data) => serverConnection.toServer(session, "moveUnit", data));
            view.uiActionGenerator.on("interactWith", (data) => serverConnection.toServer(session, "interactWith", data));
            view.uiActionGenerator.on("useAbility", (data) => serverConnection.toServer(session, "useAbility", data));

            // handle updates from server
            serverConnection.onMessageFromServer((session, action, data) => {
                // console.log("onMessageFromServer", session, action, data);
                if (action === "moveUnit") {
                    const updatedUnit = data;
                    const unit = worldState.updUnitById(updatedUnit.id, {position: updatedUnit.position, rotation: updatedUnit.rotation});
                    view.handleMoveUnit(unit);
                }
                if (action === "say") {
                    const { unitId, message } = data;
                    view.handleSay({ unitId, message });
                }
                if (action === "hit") {
                    const { source } = data;
                    view.handleHit({ source });
                }
            });
            view.setUnitLibrary(worldState.getUnitLibrary());
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
