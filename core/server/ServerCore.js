const WorldState = require("../state/WorldState");
const collisions = require("../utils/collisions");
const CharFactory = require("../state/CharFactory");
const LoopActionsQ = require("./LoopActionsQ");
const PatrolWish = require("./wishes/PatrolWish");
const SayLaterWish = require("./wishes/SayLaterWish");
const Projectile = require('./projectiles/Projectile');
const WS_ACTIONS = require("../WS_ACTIONS");
const PROJECTILES = require("../PROJECTILES.js");
const ActionsConsumer = require("./ActionsConsumer");
const isArray = require("lodash/isArray");

const VERSION = "0.0.10";
console.log("ServerCore v:" + VERSION);

class ServerCore {
    constructor() {
        this.worldState = new WorldState();
        this.unitLibrary = this.worldState.getUnitLibrary();
        this.lastLoopTime = null;
        this.wishes = [];
        this.projectiles = [];
        this.loopActionsQ = new LoopActionsQ();
        this.broadcastHandler = null;
    }

    load() {
        return this.worldState.loadSave()
        .then(() => this._instantiateWishesFromUnits(this.worldState.getUnits()))
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
        console.log(`< received:${wsAction.v} ${wsAction.name} from ${session.accountId}`);
        const wsActionName = wsAction.name;
        if (!wsActionName) {
            throw new Error("ServerCore: actionName must be defined");
        }
        // TODO validate session
        if (wsActionName === WS_ACTIONS.SYS_LOAD_USER) {
            this.broadcast({ name: WS_ACTIONS.SYS_LOAD_WORLD, worldState: { state: this.worldState.state } }, session);
        }
        if (wsActionName === WS_ACTIONS.TARGET_UNIT) {
            const sourceUnit = this.worldState.findUnit({id: wsAction.sourceUnitId});
            this.worldState.updateUnitStateById(sourceUnit.id, {targetUnitId: wsAction.targetUnitId});
            this.broadcast(wsAction);
        }
        if (wsActionName === WS_ACTIONS.SEE_THE_WORLD) {
            let controlledUnit = this.worldState.findUnit({accountId: session.accountId});
            if (!controlledUnit) {
                controlledUnit = CharFactory.initEmptyCharacter({accountId: session.accountId, name: `Account#${session.accountId}`});
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
            this.loopActionsQ.setAction({ name: "rangedHit", unitId: sourceUnit.id, sourceUnit, projectileId: wsAction.projectileId });
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
        this.lastLoopTime = now;
        this.wishes.forEach((wish) => {
            const actions = wish.getActions(delta, this.unitLibrary);
            actions && this.loopActionsQ.mergeActions(actions);
        });
        this._processActionsAndFlush();
        this._processProjectilesFlight(delta);
        this.wishes = this.wishes.filter(wish => !wish.isCompleted());
    }

    _processProjectilesFlight(delta) {
        this.projectiles.forEach((element, index) => {
            const futurePos = element.calcNextPosition(delta);
            const collisionArea = element.getCollisionArea(futurePos);
            const hitedUnits = collisions.findUnitsHittingByProjectile(this.worldState.getHitableUnits(), collisionArea);
            let smbdHitted = false;
            // if (hitedUnits) {
            const sourceUnit = element.sourceEntity;
            //do some action
            hitedUnits.forEach((targetUnit) => {
                if (targetUnit.id === sourceUnit.id) {
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
                this.broadcast({ name: WS_ACTIONS.DAMAGE_UNIT, sourceUnit, targetUnit: updTargetUnit });
            });
            // if (smbdHitted) this.broadcast({ name: 'projectileHit' }, { accountId: sourceUnit.accountId });
            // }

            element.move(futurePos);
            if (element.flightLimitsReached || smbdHitted) {
                //debug
                console.assert(
                    new Date().getTime() - element.startTime <= element.flightDuration,
                    'warn! projectile\' flight time prediction failed'
                );
                this.projectiles.splice(index, 1);
            }
        });
    }

    _processActionsAndFlush() {
        for (let unitId in this.loopActionsQ.q) {
            const unitActions = this.loopActionsQ.q[unitId];
            for (let actionName in unitActions) {
                const { wsActions, wishes } = ActionsConsumer.consume(unitActions[actionName], this.worldState);
                wsActions && this.broadcast(wsActions);
                wishes && this._instantiateWishesFromAction(wishes);
                // TODO eliminate
                if (action.name === 'rangedHit') {
                    this._instantiateProjectileFromAction(unitActions[actionName]);
                }
            }
        }
        this.loopActionsQ.flush();
    }

    _instantiateProjectileFromAction(action) {
        // props for projectile
        const { distance, speed, bounds} = PROJECTILES[action.projectileId];
        
        const newProjectile = new Projectile(action.sourceUnit, speed, distance, bounds);
        newProjectile.startTime = new Date().getTime(); // for tests
        // TODO -v do not affect vars. be functional
        // action.distance = distance;
        // action.flightDuration = newProjectile.flightDuration;
        this.projectiles.push(newProjectile);
        this.broadcast({
            name: WS_ACTIONS.RANGE_ATTACK,
            sourceUnit: { id: action.sourceUnit.id },
            projectileId: action.projectileId,
            flightDuration: newProjectile.flightDuration
        });
    }

    _instantiateWishesFromUnits(units){
        for (let i in units) {
            const unit = units[i];
            if (!unit.wishes) {
                continue;
            }
            unit.wishes.forEach((wishDescription) => {
                const wish = this._instantiateWish(unit, wishDescription);
                wish && this.wishes.push(wish);
            });
        }
    }

    _instantiateWishesFromAction(wishDescriptions){
        wishDescriptions.forEach((wishDescription) => {
            const unit = this.worldState.findUnit({ id: wishDescription.unitId });
            const wish = this._instantiateWish(unit, wishDescription);
            wish && this.wishes.push(wish);
        });
    }

    _instantiateWish(unit, wishDescription){
        const mapping = {
            "PatrolWish": PatrolWish,
            "SayLaterWish": SayLaterWish,
        };
        const Wish = mapping[wishDescription.name];
        if (!Wish) {
            console.log("Wish not found: " + wishDescription.name);
            return;
        }
        return new Wish(unit, wishDescription);
    }

    initDisconnectedAction(){
        return { name: WS_ACTIONS.SYS_DISCONNECTED };
    }
}

module.exports = ServerCore;
