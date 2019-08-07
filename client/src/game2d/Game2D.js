import View from "./view/View";
import RemoteServerConnection from "./RemoteServerConnection";
import keyMouseActions from "./keyMouseActions";
import WorldState from "../../../core/state/WorldState";
import WS_ACTIONS from "../../../core/WS_ACTIONS";
import decorateWithEvents from "src/../../core/utils/decorateWithEvents";

const servers = {
    production: "ws://35.240.39.143:8080",
    local: "ws://localhost:8080",
};

class Game2D {
    constructor({ version }) {
        this.serverConnection = new RemoteServerConnection({ VERSION: version });
        this.worldState = new WorldState();
        this.view = new View();
        this.session = {};
    }

    init ({ elId, serverName = "production", accountId, addPing } = {}) {
        this.session.accountId = accountId;
        // init
        this.view.createCanvas(document, { elId });

        // connect to server & get the world
        this.serverConnection.onMessageFromServer((action) => {
            if (addPing) {
                return setTimeout(() => {
                    this.handleMessageFromServer(action);
                }, addPing);
            }
            this.handleMessageFromServer(action);
        });
        this.serverConnection.connect(this.session, servers[serverName])
        .then(() => {
            this.serverConnection.toServer({ name: "sysLoadUser" });
        });
    }

    handleMessageFromServer = (action) => {
        const actionName = action.name;

        if (!actionName) {
            throw new Error("handleMessageFromServer: action.name is required");
        }

        // system messages
        if (action.name === "sysLoadWorld") {
            this.loadWorld(action, this.session);
        }
        if (action.name === "sysAddDynamicUnit") {
            this.worldState.addDynamicUnit(action.unit);
            this.view.addNewUnit(action.unit);
        }
        if (action.name === "sysDisconnected") {
            alert("Disconnected from the server.");
            window.location.reload();
        }

        // game messages
        if (actionName === "moveUnit") {
            if (this.view.controlledUnit && this.view.controlledUnit.id !== action.unitId) {
                const unit = this.worldState.updUnitById(action.unitId, action.uPoint);
                this.view.moveNotControlledUnit(unit);
            }
        }
        if (actionName === "say") {
            const { unitId, message } = action;
            // react html way
            const uPoint = this.view.getScreenUPointOfUnit(unitId);
            this.emit("uiStateAction", { name: "say", message, uPoint });
            // canvas way
            // this.view.handleSay(action);
        }
        if (actionName === "hit") {
            this.view.handleHit(action);
        }
        if (actionName === "debugArea") {
            this.view.handleDebugArea(action);
        }
        if (actionName === "damage") {
            const damagedUnit = this.worldState.updUnitById(action.targetUnit.id, { state: action.targetUnit.state });
            this.view.handleDamageUnit(damagedUnit);
            // upd hp bar
            const controlledUnit = this.view.controlledUnit;
            if (controlledUnit.id === damagedUnit.id) {
                this.emit("uiStateAction", { name: "updateControlledUnit", controlledUnit });
            }
        }
        if (actionName === "takeControl") {
            const controlledUnit = this.worldState.findUnit({id: action.unitId});
            this.view.setControlledUnit(controlledUnit);
            this.emit("uiStateAction", { name: "updateControlledUnit", controlledUnit });
        }
    };

    loadWorld(worldFromServer){
        this.worldState.setState({ units: worldFromServer.worldState.state.units });

        // load view
        return this.view.loadAndAddItemsToStage(this.worldState.state.units)
        .then(() => {
            // bind keys & mouse
            keyMouseActions.sub(window);
            this.view.listenToInput(keyMouseActions);

            // send data to server
            this.view.uiActionGenerator.on("moveUnit", (data) => {
                const unit = this.worldState.updUnitById(data.unitId, data.uPoint);
                this.view.moveControlledUnit(unit);
                this.serverConnection.toServer(data);
            });
            this.view.uiActionGenerator.on("interactWith", (data) => {
                this.serverConnection.toServer(data)
            });
            this.view.uiActionGenerator.on("useAbility", (data) => {
                this.serverConnection.toServer(data);
            });
            this.view.on("targetItem", (item) => {
                this.serverConnection.toServer({ name: WS_ACTIONS.TARGET_UNIT, sourceUnitId: this.view.controlledUnit.id, targetUnitId: item.unitId });
            });

            this.view.setUnitLibrary(this.worldState.getUnitLibrary());
            this.view.resize();
        })
        .then(() => {
            this.serverConnection.toServer({name: WS_ACTIONS.SEE_THE_WORLD})
        });
    }
}

export default decorateWithEvents(Game2D);
