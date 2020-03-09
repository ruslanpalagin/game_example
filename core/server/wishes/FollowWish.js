const collisions = require("../../utils/collisions");
const ABaseWish = require("./ABaseWish");

class PatrolWish extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
        this.targetUnit = unitLibrary.findUnit({id: wishDescription.targetUnitId });
    }

    getActions(delta){
        const actions = [];

        const distance = collisions.getDistance(this.unit, this.targetUnit);
        if (distance > 15) {
            const moveAction = {
                name: "MoveUnitAction",
                unitId: this.unit.id,
                uPoint: collisions.movementPointBetween(this.unit, { position: this.targetUnit.position }, { speed: this.unit.state.speed, delta }),
            };
            actions.push(moveAction);
        }

        return actions;
    }

    isActive(){
        return !this.unit.state.isDead;
    }
}

module.exports = PatrolWish;

