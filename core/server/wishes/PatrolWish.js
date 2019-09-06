const isEqual = require("lodash/isEqual");
const collisions = require("../../utils/collisions");
const ABaseWish = require("./ABaseWish");

class PatrolWish extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
        this.points = wishDescription.points;
        this.targetPointIndex = 0;
    }

    getActions(delta){
        const actions = [];

        const point = this.points[this.targetPointIndex];
        const moveAction = {
            name: "MoveUnitAction",
            unitId: this.unit.id,
            uPoint: collisions.movementPointBetween(this.unit, { position: point.position }, { speed: this.unit.state.speed, delta }),
        };

        if (isEqual(moveAction.uPoint.position, point.position)) {
            this.targetPointIndex++;
        }

        if (Math.random() > 0.99) {
            actions.push({ name: "MeleeAttackAction", sourceUnit: this.unit, unitId: this.unit.id });
        }

        if (this.targetPointIndex > this.points.length - 1){
            this.targetPointIndex = 0;
        }

        actions.push(moveAction);

        return actions;
    }

    isActive(){
        return !this.unit.state.isDead;
    }
}

module.exports = PatrolWish;

