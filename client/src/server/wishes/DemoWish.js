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
        const action = {
            name: "moveUnit",
            unitId: this.unit.id,
            uPoint: collisions.movementPointBetween(this.unit, { position: point.position }, { speed: UNIT_SPEED, delta }),
        };

        if (isEqual(action.uPoint.position, point.position)) {
            this.targetPoint++;
        }

        if (this.targetPoint > this.points.length - 1){
            this.isLast = true;
            action.uPoint.rotation = point.rotation;
        }

        // console.log("action.uPoint.rotation", action.uPoint.rotation);

        return [
            action
        ];
    }

    isCompleted(){
        return this.isLast;
    }
}
