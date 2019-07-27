import View from "./view/View";
import WorldState from "../../../core/state/WorldState";
import RemoteServerConnection from "./RemoteServerConnection";
import keyMouseActions from "./uiActionDecoders/keyMouseActions";

const worldState = new WorldState();
const serverConnection = new RemoteServerConnection();
const view = new View();
const servers = {
    production: "ws://35.240.39.143:8080",
    local: "ws://localhost:8080",
};

export default class Game2D {
    init ({ elId, serverName = "production", accountId, addPing } = {}) {
        const session = {accountId};
        // init
        view.createCanvas(document, { elId });

        // connect to server & get world
        const handleMessageFromServer = (action) => {
            const actionName = action.name;

            // console.log("onMessageFromServer", session, action);
            if (!actionName) {
                throw new Error("onMessageFromServer: actionName is required");
            }

            // system messages
            if (action.name === "sysLoadWorld") {
                this.loadWorld(action, session)
                .then(() => {
                    serverConnection.toServer({name: "seeTheWorld"})
                })
            }
            if (action.name === "sysAddDynamicUnit") {
                worldState.addDynamicUnit(action.unit);
                view.addNewUnit(action.unit);
            }

            // game messages
            if (actionName === "moveUnit") {
                if (view.controlledUnit && view.controlledUnit.id !== action.unitId) {
                    const unit = worldState.updUnitById(action.unitId, action.uPoint);
                    view.moveNotControlledUnit(unit);
                }
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
            if (actionName === "takeControl") {
                const controlledUnit = worldState.findUnit({id: action.unitId});
                view.setControlledUnit(controlledUnit);
            }
        };
        serverConnection.onMessageFromServer((action) => {
            if (addPing) {
                return setTimeout(() => {
                    handleMessageFromServer(action);
                }, addPing);
            }
            handleMessageFromServer(action);
        });
        serverConnection.connect(session, servers[serverName]).then(() => {
            serverConnection.toServer({ name: "sysLoadUser" });
        });
    }

    loadWorld(world){
        worldState.setState({ units: world.worldState.state.units });

        // load view
        return view.loadAndAddItems(worldState.state.units)
        .then(() => {
            // bind keys & mouse
            keyMouseActions.sub(window);
            view.listenToInput(keyMouseActions);

            // send data to server
            // TODO listen to view instead of directly to uiActionGenerator
            view.uiActionGenerator.on("moveUnit", (data) => {
                const unit = worldState.updUnitById(data.unitId, data.uPoint);
                view.moveControlledUnit(unit);
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