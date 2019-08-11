class AggressiveWish {
    constructor(unit, wishDescription, unitLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitLibrary = unitLibrary;
        this.lastSayAt = this.now(); // debug only
        this.target = null;
    }

    getActions(delta){
        const actions = [];
        // debug
        if (this.lastSayAt + 1000 < this.now()) {
            this.lastSayAt = this.now();
            this.target && actions.push({ name: "SayAreaAction", message: "Target: " + this.target.name, unitId: this.unit.id });
        }
        // set target
        if (!this.target){
            const units = this.unitLibrary.getUnitsInArea({ position: this.unit.position, radius: this.wishDescription.agroRadius });
            if (units && units[0]) {
                this.target = units[0];
            }
        }
        // move to target

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

