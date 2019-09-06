const collisions = require("../../utils/collisions");
// const ABaseWish = require("./ABaseWish");
const FollowWish = require("./FollowWish");

const ATTACK_RANGE = 30;

class AggressiveWish{
    constructor(unit, wishDescription, unitLibrary){
        this.unit = unit;
        this.anchorUPoint = null;
        this.wishDescription = wishDescription;
        this.unitLibrary = unitLibrary;
        this.lastSayAt = this.now(); // debug only
        this.status = ""; // debug only
        this.target = null;
        this.wishes = []; // running in parallels
    }

    _follow(target) {
        const wish = new FollowWish(
            this.unit,
            { name: "FollowWish", unitId: this.unit.id, targetUnitId: target.id },
            this.unitLibrary,
        );
        this.wishes.push(wish);
    }

    _unFollow() {
        const wish = this.wishes.find((w) => w.wishDescription.name === "FollowWish");
        wish && this.wishes.splice(this.wishes.indexOf(wish), 1);
    }

    getActions(delta){
        let actions = [];
        // debug
        if (this.lastSayAt + 2000 < this.now()) {
            this.lastSayAt = this.now();
            this.target && actions.push({ name: "SayAreaAction", message: this.status, unitId: this.unit.id });
        }
        // set target
        if (!this.target){
            const units = this.unitLibrary.getUnitsInArea({ position: this.unit.position, radius: this.wishDescription.agroRadius });
            const target = units.find((unit) => unit.id !== this.unit.id);
            target && (!target.state.isDead) && this._setTarget(target);
        }
        if (this.target && Math.random() < 0.1 && collisions.getDistance(this.unit, this.target) <= ATTACK_RANGE) {
            console.log("this.target", this.target);
            actions.push({ name: "MeleeAttackAction", unitId: this.unit.id, sourceUnit: this.unit });
        }
        if (this.target && this.target.state.isDead) {
            this._setTarget(null);
        }
        if (this.target) {
            const distance = collisions.getDistance(this.unit, this.anchorUPoint);
            distance >= this.wishDescription.followRadius && this._setTarget(null);
        }
        this.wishes.forEach((wish) => {
            actions = actions.concat(wish.getActions(delta));
        });

        return actions;
    }

    _setTarget(target) {
        this.anchorUPoint = {position: this.unit.position, rotation: this.unit.rotation};
        this.target = target;
        this.status = "Target: " + (this.target && this.target.name);
        target ? this._follow(target) : this._unFollow();
    }

    getPriority(){
        return this.unit.state.isDead ? 0 : 1;
    }

    now() {
        return (new Date()).getTime();
    }
}

module.exports = AggressiveWish;

