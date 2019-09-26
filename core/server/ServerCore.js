const DefaultWorldState = require("../state/WorldState");
const collisions = require("../utils/collisions");
const CharFactory = require("../state/CharFactory");
const LoopActionsQ = require("./LoopActionsQ");
const WishManager = require("./WishManager");
const WS_ACTIONS = require("../WS_ACTIONS");
const ActionsConsumer = require("./ActionsConsumer");
const isArray = require("lodash/isArray");
const debug = require('debug')('ws');

const VERSION = "0.0.13";
console.log("ServerCore v:" + VERSION);

const TIME_MULTIPLER = 550;

class ServerCore {
    constructor({ WorldState } = {}) {
        this.worldState = new (WorldState || DefaultWorldState)();
        this.unitLibrary = this.worldState.getUnitLibrary();
        this.lastLoopTime = null;
        this.loopActionsQ = new LoopActionsQ();
        this.wishManager = new WishManager(this.unitLibrary);
        this.broadcastHandler = null;
    }

    load() {
        return this.worldState.loadSave()
            .then(() => this.wishManager.initWishesFromUnits(this.worldState.getUnits()))
            .then(() => this._startGameLoop())
            ;
    }

    broadcast(wsAction, session) {
        const wsActions = isArray(wsAction) ? wsAction : [wsAction];
        wsActions.forEach((wsAction) => {
            wsAction.v = VERSION;
            this.broadcastHandler(wsAction, session);
        });
    }

    handleBroadcast(callback) {
        this.broadcastHandler = callback;
    }

    pushActionRequest(wsAction, session) {
        debug(`< received:${wsAction.v} ${wsAction.name} from ${session.accountId}`);
        const wsActionName = wsAction.name;
        if (!wsActionName) {
            throw new Error("ServerCore: actionName must be defined");
        }
        // TODO validate session
        if (wsActionName === WS_ACTIONS.SYS_LOAD_USER) {
            this.broadcast({ name: WS_ACTIONS.SYS_LOAD_WORLD, worldState: { state: this.worldState.state } }, session);
        }
        if (wsActionName === WS_ACTIONS.TARGET_UNIT) {
            const sourceUnit = this.worldState.findUnit({ id: wsAction.sourceUnitId });
            this.worldState.updateUnitStateById(sourceUnit.id, { targetUnitId: wsAction.targetUnitId });
            this.broadcast(wsAction);
        }
        if (wsActionName === WS_ACTIONS.SEE_THE_WORLD) {
            let controlledUnit = this.worldState.findUnit({ accountId: session.accountId });
            if (!controlledUnit) {
                controlledUnit = CharFactory.initEmptyCharacter({ accountId: session.accountId, name: `Account#${session.accountId}` });
                this.worldState.addDynamicUnit(controlledUnit);
                this.broadcast({ name: WS_ACTIONS.SYS_ADD_DYNAMIC_UNIT, unit: controlledUnit });
            };
            setTimeout(() => {
                this.broadcast({ name: WS_ACTIONS.TAKE_CONTROL, unitId: controlledUnit.id }, session);
            }, 500); // TODO batch updates
        }
        if (wsActionName === WS_ACTIONS.MOVE_UNIT) {
            const { unitId, uPoint } = wsAction;
            this.loopActionsQ.setAction({ name: "MoveUnitAction", unitId, uPoint });
        }
        if (wsActionName === WS_ACTIONS.USE_ABILITY) {
            const sourceUnit = this.worldState.findUnit({ id: wsAction.sourceUnit.id });
            if (wsAction.slot === 1) {
                this.loopActionsQ.setAction({ name: "MeleeAttackAction", unitId: sourceUnit.id, sourceUnit }); //meleeHit
            }
        }
        if (wsActionName === WS_ACTIONS.INTERACT_WITH) {
            this.loopActionsQ.setAction({ ...wsAction, name: "InteractWithAction", unitId: wsAction.sourceUnit.id });
        }
        if (wsActionName === WS_ACTIONS.RANGE_ATTACK) {
            this.loopActionsQ.setAction({ name: "RangeAttackAction", unitId: wsAction.sourceUnit.id, sourceUnit: wsAction.sourceUnit, projectileId: wsAction.projectileId });
        }
    }

    _startGameLoop() {
        this.lastLoopTime = (new Date()).getTime();
        setInterval(() => {
            this._doLoopTick();
        }, 50);
    }

    _doLoopTick() {
        const now = (new Date()).getTime();
        const delta = now - this.lastLoopTime;
        this.worldState.incTime(delta * TIME_MULTIPLER);
        const time = this.unitLibrary.getTime();
        // console.log("time", time);
        this.lastLoopTime = now;
        /* OLD CODE */
        // this.wishes.forEach((wish) => {
        //     const actions = wish.getActions(delta, this.unitLibrary);
        //     actions && this.loopActionsQ.mergeActions(actions);
        // });
        // this._processActionsAndFlush();
        /* OLD CODE */
        /* NEW CODE */
        const { actions } = this.wishManager.getActions(delta);
        this.loopActionsQ.mergeActions(actions);
        this._processActionsAndFlush(this.loopActionsQ);
        /* NEW CODE */
        this._processProjectilesFlight(delta);
    }

    _processProjectilesFlight(delta) {
        this.worldState.state.projectiles.forEach((element, index) => {
            const futurePos = element.calcNextPosition(delta);
            const collisionArea = element.getCollisionArea(futurePos);
            const hitedUnits = collisions.findUnitsHittingByProjectile(this.worldState.getHitableUnits(), collisionArea);
            let smbdHitted = false;
            // if (hitedUnits) {
            const sourceUnitId = element.sourceEntityId;
            //do some action
            hitedUnits.forEach((targetUnit) => {
                if (targetUnit.id === sourceUnitId) {
                    return;
                }
                if (targetUnit.state.isDead) {
                    return;
                }
                smbdHitted = true;
                const newHp = targetUnit.state.hp - 20;
                const isDead = newHp <= 0;
                const newState = Object.assign(targetUnit.state, { hp: newHp, isDead });
                const updTargetUnit = this.worldState.updateUnitById(targetUnit.id, { state: newState });
                this.broadcast({ name: WS_ACTIONS.DAMAGE_UNIT, sourceUnit: { id: sourceUnitId }, targetUnit: { id: updTargetUnit.id, state: updTargetUnit.state } });
            });
            // if (smbdHitted) this.broadcast({ name: 'projectileHit' }, { accountId: sourceUnit.accountId });
            // }

            element.move(futurePos);
            if (element.flightLimitsReached || smbdHitted) {
                //debug
                if (new Date().getTime() - element.startTime <= element.flightDuration)
                    console.log('warn! projectile\' flight time prediction failed');
                this.worldState.state.projectiles.splice(index, 1);
            }
        });
    }

    _processActionsAndFlush() {
        for (let unitId in this.loopActionsQ.q) {
            const unitActions = this.loopActionsQ.q[unitId];
            for (let actionName in unitActions) {
                const { wsActions } = ActionsConsumer.consume(unitActions[actionName], this.worldState);
                wsActions && this.broadcast(wsActions);
            }
        }
        this.loopActionsQ.flush();
    }

    initDisconnectedAction() {
        return { name: WS_ACTIONS.SYS_DISCONNECTED };
    }
}

module.exports = ServerCore;
