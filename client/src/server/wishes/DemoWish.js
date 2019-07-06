import isEqual from "lodash/isEqual";
import collisions from "src/common/collisions.js";

export default class DemoWish {
    constructor(unit, wish){
        this.unit = unit;
        this.points = wish.points;
        this.targetPoint = 0;
        this.isLast = false;
    }

    getActions(delta){
        // console.log("delta", delta);
        const UNIT_SPEED = 30;
        const point = this.points[this.targetPoint];
        const moveAction = {
            name: "moveUnit",
            unitId: this.unit.id,
            uPoint: collisions.movementPointBetween(this.unit, { position: point.position }, { speed: UNIT_SPEED, delta }),
        };

        if (isEqual(moveAction.uPoint.position, point.position)) {
            this.targetPoint++;
        }

        if (this.targetPoint > this.points.length - 1){
            this.isLast = true;
            moveAction.uPoint.rotation = point.rotation;
        }

        const actions = [moveAction];

        if (Math.random() > 0.99) {
            actions.push({
                name: "hit",
                sourceUnit: this.unit,
                unitId: this.unit.id,
            });
        }

        return actions;
    }

    isCompleted(){
        return this.unit.state.isDead || this.isLast;
    }
}
