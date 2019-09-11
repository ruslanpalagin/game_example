const collisions = require("../../utils/collisions");
const ABaseWish = require("./ABaseWish");

class PatrolWish extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
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

    isActive(){
        return !this.unit.state.isDead;
    }
}

module.exports = PatrolWish;

