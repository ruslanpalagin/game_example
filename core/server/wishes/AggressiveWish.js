const collisions = require("../../utils/collisions");

class AggressiveWish {
    constructor(unit, wishDescription, unitLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitLibrary = unitLibrary;
        this.lastSayAt = this.now(); // debug only
        this.status = ""; // debug only
        this.target = null;
    }

    getActions(delta){
        const ATTACK_RANGE = 30;
        const actions = [];
        // debug
        if (this.lastSayAt + 2000 < this.now()) {
            this.lastSayAt = this.now();
            this.target && actions.push({ name: "SayAreaAction", message: this.status, unitId: this.unit.id });
        }
        // set target
        if (!this.target){
            const units = this.unitLibrary.getUnitsInArea({ position: this.unit.position, radius: this.wishDescription.agroRadius });
            if (units && units[0]) {
                this.target = units[0];
                this.status = "Target: " + this.target.name;

                // move to target
                const followWithDescription = { name: "FollowWish", unitId: this.unit.id, targetUnitId: this.target.id };
                actions.push({ name: "NewWishAction", unitId: this.unit.id, wishDescription: followWithDescription });
            }
        }
        if (this.target && Math.random() < 0.01 && collisions.getDistance(this.unit, this.target) <= ATTACK_RANGE) {
            actions.push({ name: "MeleeAttackAction", unitId: this.unit.id, sourceUnit: this.unit });
        }
        if (this.target.state.isDead) {
            this.target = null;
        }

        return actions;
    }

    isCompleted(){
        return this.unit.state.isDead;
    }

    now() {
        return (new Date()).getTime();
    }
}

module.exports = AggressiveWish;

