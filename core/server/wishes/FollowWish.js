const collisions = require("../../utils/collisions");

class PatrolWish {
    constructor(unit, wishDescription, unitLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitLibrary = unitLibrary;
        this.targetUnit = unitLibrary.findUnit({id: wishDescription.targetUnitId });
    }

    getActions(delta){
        const actions = [];

        const UNIT_SPEED = 25;
        const moveAction = {
            name: "MoveUnitAction",
            unitId: this.unit.id,
            uPoint: collisions.movementPointBetween(this.unit, { position: this.targetUnit.position }, { speed: UNIT_SPEED, delta }),
        };

        actions.push(moveAction);

        return actions;
    }

    isCompleted(){
        return this.unit.state.isDead;
    }
}

module.exports = PatrolWish;

