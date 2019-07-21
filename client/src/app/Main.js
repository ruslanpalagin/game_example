import View from "src/view/View";
import WorldState from "src/state/WorldState";
import RemoteServerConnection from "src/app/RemoteServerConnection";
import keyMouseActions from "src/uiActionDecoders/keyMouseActions";

const worldState = new WorldState();
const serverConnection = new RemoteServerConnection();
const view = new View();
const session = { accountId: parseInt(prompt("Please enter account ID")) };
// const session = { accountId: 1 };

export default class Main {
    init () {
        // init
        view.createCanvas(document, { elId: "game__main-frame" });

        // connect to server & get world
        serverConnection.onMessageFromServer((action) => {
            const actionName = action.name;

            // console.log("onMessageFromServer", session, action);
            if (!actionName) {
                throw new Error("onMessageFromServer: actionName is required");
            }

            // system messages
            if (action.name === "sysLoadWorld") {
                this.loadWorld(action);
            }

            // game messages
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
        serverConnection.connect(session).then(() => {
            serverConnection.toServer({ name: "sysLoadUser" });
        });
    }

    loadWorld(world){
        worldState.setState(world.worldState.state);

        // load view
         view.loadAndAddItems(worldState.state.units)
        .then(() => {
            // bind keys & mouse
            keyMouseActions.sub(window);

            // control character & set it to the center of the view
            const controlledUnit = worldState.findUnit({accountId: session.accountId});
            view.setControlledUnit(controlledUnit);
            view.listenToInput(keyMouseActions);

            // send data to server
            // TODO listen to view instead of directly to uiActionGenerator
            view.uiActionGenerator.on("moveUnit", (data) => {
                const unit = worldState.updUnitById(data.unitId, data.uPoint);
                view.handleMoveUnit(unit);
                serverConnection.toServer(data);
            });
            view.uiActionGenerator.on("interactWith", (data) => {
                serverConnection.toServer(data)
            });
            view.uiActionGenerator.on("useAbility", (data) => {
                serverConnection.toServer(data);
            });

            view.setUnitLibrary(worldState.getUnitLibrary());
            view.resize();
        });
    }
}