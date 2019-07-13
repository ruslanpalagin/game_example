import React from 'react';
import View from "src/view/View";
import WorldState from "src/state/WorldState";
import RemoveServerConnection from "src/app/RemoveServerConnection";
import keyMouseActions from "src/uiActionDecoders/keyMouseActions";

const worldState = new WorldState();
const serverConnection = new RemoveServerConnection();
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
            view.uiActionGenerator.on("moveUnit", (data) => {
                const unit = worldState.updUnitById(data.unitId, data.uPoint);
                view.handleMoveUnit(unit);
                serverConnection.toServer(session, data);
            });
            view.uiActionGenerator.on("interactWith", (data) => {
                serverConnection.toServer(session, data)
            });
            view.uiActionGenerator.on("useAbility", (data) => {
                serverConnection.toServer(session, data);
            });

            // handle updates from server
            serverConnection.onMessageFromServer((session, action) => {
                const actionName = action.name;
                // console.log("onMessageFromServer", session, action);
                if (!actionName) {
                    throw new Error("onMessageFromServer: actionName is required");
                }
                if (actionName === "moveUnit") {
                    // console.log("data", data);
                    const unit = worldState.updUnitById(action.unitId, action.uPoint);
                    view.handleMoveUnit(unit);
                }
                if (actionName === "say") {
                    const { unitId, message } = action;
                    view.handleSay({ unitId, message });
                }
                if (actionName === "hit") {
                    view.handleHit(action);
                }
                if (actionName === "debugArea") {
                    view.handleDebugArea(action);
                }
                if (actionName === "damage") {
                    const unit = worldState.updUnitById(action.targetUnit.id, { state: action.targetUnit.state });
                    view.handleDamageUnit(unit);
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
