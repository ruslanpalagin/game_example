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
            this.serverConnection.toServer({ name: WS_ACTIONS.SYS_LOAD_USER });
        });
    }

    handleMessageFromServer = (wsAction) => {
        const wsActionName = wsAction.name;

        if (!wsActionName) {
            throw new Error("handleMessageFromServer: action.name is required");
        }

        // system messages
        if (wsAction.name === WS_ACTIONS.SYS_LOAD_WORLD) {
            this.loadWorld(wsAction, this.session);
        }
        if (wsAction.name === WS_ACTIONS.SYS_ADD_DYNAMIC_UNIT) {
            this.worldState.addDynamicUnit(wsAction.unit);
            this.view.addNewUnit(wsAction.unit);
        }
        if (wsAction.name === WS_ACTIONS.SYS_DISCONNECTED) {
            alert("Disconnected from the server.");
            window.location.reload();
        }

        // game messages
        if (wsActionName === WS_ACTIONS.MOVE_UNIT) {
            if (this.view.controlledUnit && this.view.controlledUnit.id !== wsAction.unitId) {
                const unit = this.worldState.updUnitById(wsAction.unitId, wsAction.uPoint);
                this.view.moveNotControlledUnit(unit);
            }
        }
        if (wsActionName === "say") {
            const { unitId, message } = wsAction;
            // react html way
            const unit = this.worldState.findUnit({ id: unitId });
            this.emit("uiStateAction", { name: "say", message, unit });
            // canvas way
            // this.view.handleSay(action);
        }
        if (wsActionName === "hit") {
            this.view.handleHit(wsAction);
        }
        if (wsActionName === WS_ACTIONS.RANGED_ATTACK) {
            this.view.handleRangedHit(wsAction);
        }
        if (wsActionName === "debugArea") {
            this.view.handleDebugArea(wsAction);
        }
        if (wsActionName === "damage") {
            const damagedUnit = this.worldState.updUnitById(wsAction.targetUnit.id, { state: wsAction.targetUnit.state });
            this.view.handleDamageUnit(damagedUnit).then(() => {});
            // upd hp bar
            this.emit("uiStateAction", { name: "updateControlledUnit", controlledUnit: this.view.controlledUnit });
            this.emit("uiStateAction", { name: "updateTargetUnit", targetUnit: this.view.targetUnit });
        }
        if (wsActionName === WS_ACTIONS.TAKE_CONTROL) {
            const controlledUnit = this.worldState.findUnit({id: wsAction.unitId});
            this.view.setControlledUnit(controlledUnit);
            this.emit("uiStateAction", { name: "updateControlledUnit", controlledUnit });
        }
        if (wsActionName === WS_ACTIONS.TARGET_UNIT) {
            const sourceUnit = this.worldState.updUnitStateById(wsAction.sourceUnitId, { targetUnitId: wsAction.targetUnitId });
            const targetUnit = this.worldState.findUnit({id: wsAction.targetUnitId});
            // upd hp bar
            if (this.view.controlledUnit.id === sourceUnit.id) {
                this.view.setTargetUnit(targetUnit);
            }
            this.emit("uiStateAction", { name: "updateControlledUnit", controlledUnit: this.view.controlledUnit });
            this.emit("uiStateAction", { name: "updateTargetUnit", targetUnit: this.view.targetUnit });
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
            this.view.on("moveUnit", (data) => {
                const unit = this.worldState.updUnitById(data.unitId, data.uPoint);
                this.view.moveControlledUnit(unit);
                this.serverConnection.toServer({ name: WS_ACTIONS.MOVE_UNIT, unitId: data.unitId, uPoint: data.uPoint });
            });
            this.view.on("interactWith", ({sourceUnit, targetUnit}) => {
                this.serverConnection.toServer({ name: WS_ACTIONS.INTERACT_WITH, sourceUnit, targetUnit })
            });
            this.view.on("useAbility", ({ slot }) => {
                this.serverConnection.toServer({ name: WS_ACTIONS.USE_ABILITY, slot, sourceUnit: { id: this.view.controlledUnit.id } });
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
