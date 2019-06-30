import collisions from "src/common/collisions.js";

export default class DemoWish {
    constructor(unit, wish){
        this.unit = unit;
        this.points = wish.points;
        this.targetPoint = 0;
    }

    getActions(delta){
        const UNIT_SPEED = 60;
        const point = this.points[this.targetPoint];
        const action = {
            name: "move",
            unit: this.unit,
            point: collisions.movementPointBetween(this.unit, point, UNIT_SPEED)
        };
        return [];
    }
    isCompleted(){}
}