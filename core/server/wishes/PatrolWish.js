const isEqual = require("lodash/isEqual");
const collisions = require("../../utils/collisions");

class PatrolWish {
    constructor(unit, wishDescription){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.points = wishDescription.points;
        this.targetPoint = 0;
        this.isLast = false;
    }

    getActions(delta){
        const actions = [];

        const UNIT_SPEED = 30;
        const point = this.points[this.targetPoint];
        const moveAction = {
            name: "MoveUnitAction",
            unitId: this.unit.id,
            uPoint: collisions.movementPointBetween(this.unit, { position: point.position }, { speed: UNIT_SPEED, delta }),
        };

        if (isEqual(moveAction.uPoint.position, point.position)) {
            this.targetPoint++;
        }

        if (Math.random() > 0.99) {
            actions.push({ name: "MeleeAttackAction", sourceUnit: this.unit, unitId: this.unit.id });
        }

        if (this.targetPoint > this.points.length - 1){
            this.isLast = true;
            moveAction.uPoint.rotation = point.rotation;
            actions.push({ name: "NewWishAction", wishDescription: this.wishDescription, unitId: this.unit.id });
        }

        actions.push(moveAction);

        return actions;
    }

    isCompleted(){
        return this.unit.state.isDead || this.isLast;
    }
}

module.exports = PatrolWish;

