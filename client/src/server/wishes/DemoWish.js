import isEqual from "lodash/isEqual";
import collisions from "src/common/collisions.js";

export default class DemoWish {
    constructor(unit, wish){
        this.unit = unit;
        this.points = wish.points;
        this.targetPoint = 0;
    }

    getActions(delta){
        console.log("delta", delta);
        const UNIT_SPEED = 30;
        const point = this.points[this.targetPoint];
        const action = {
            name: "moveUnit",
            unitId: this.unit.id,
            uPoint: collisions.movementPointBetween(this.unit, point, { speed: UNIT_SPEED, delta }),
        };

        if (isEqual(action.uPoint, point)) {
            this.points[]
        }

        return [
            action
        ];
    }

    isCompleted(){}
}