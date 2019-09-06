const collisions = require("../../utils/collisions");
const ABaseWish = require("./ABaseWish");
const FollowWish = require("./FollowWish");

const ATTACK_RANGE = 30;

class AggressiveWish extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
        this.anchorUPoint = null;
        this.lastSayAt = this._now(); // debug only
        this.status = ""; // debug only
        this.target = null;
        this.followWish = null;
    }

    _follow(target) {
        this.followWish = new FollowWish(
            this.unit,
            { name: "FollowWish", unitId: this.unit.id, targetUnitId: target.id },
            this.unitLibrary,
        );
    }

    _unFollow() {
        this.followWish = null;
    }

    getActions(delta){
        let actions = [];
        // debug
        if (this.lastSayAt + 2000 < this._now()) {
            this.lastSayAt = this._now();
            this.target && actions.push({ name: "SayAreaAction", message: this.status, unitId: this.unit.id });
        }
        // set target
        if (!this.target){
            const units = this.unitLibrary.getUnitsInArea({ position: this.unit.position, radius: this.wishDescription.agroRadius });
            const target = units.find((unit) => unit.id !== this.unit.id);
            target && (!target.state.isDead) && this._setTarget(target);
        }
        if (this.target && Math.random() < 0.1 && collisions.getDistance(this.unit, this.target) <= ATTACK_RANGE) {
            actions.push({ name: "MeleeAttackAction", unitId: this.unit.id, sourceUnit: this.unit });
        }
        if (this.target && this.target.state.isDead) {
            this._setTarget(null);
        }
        if (this.target) {
            const distance = collisions.getDistance(this.unit, this.anchorUPoint);
            distance >= this.wishDescription.followRadius && this._setTarget(null);
        }
        if (this.target && this.followWish && collisions.getDistance(this.unit, this.target) > ATTACK_RANGE / 2) {
            actions = actions.concat(this.followWish.getActions(delta));
        }

        return actions;
    }

    _setTarget(target) {
        this.anchorUPoint = {position: this.unit.position, rotation: this.unit.rotation};
        this.target = target;
        this.status = "Target: " + (this.target && this.target.name);
        target ? this._follow(target) : this._unFollow();
    }

    isActive() {
        return !this.unit.state.isDead;
    }

    _now() {
        return (new Date()).getTime();
    }
}

module.exports = AggressiveWish;

