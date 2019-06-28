import decorateWithEvents from "src/utils/decorateWithEvents";

class UiActionGenerator {
    constructor() {
        this.lastLoopTime = null
    }

    loop(controls, {controlledUnit}) {
        this.lastLoopTime = this.lastLoopTime || (new Date()).getTime();
        const MOVE_SPEED = 60;
        const ROTATION_SPEED = 3;
        const newV = {};
        const currentTime = (new Date()).getTime();
        const delta = (currentTime - this.lastLoopTime) / 1000;
        this.lastLoopTime = currentTime;
        if (controls.pressed["up"]) {
            newV.position = newV.position || {};
            newV.position.x = controlledUnit.position.x + Math.sin(controlledUnit.rotation) * MOVE_SPEED * delta;
            newV.position.y = controlledUnit.position.y - Math.cos(controlledUnit.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["down"]) {
            newV.position = newV.position || {};
            newV.position.x = controlledUnit.position.x - Math.sin(controlledUnit.rotation) * MOVE_SPEED * delta;
            newV.position.y = controlledUnit.position.y + Math.cos(controlledUnit.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["left"]) {
            newV.position = newV.position || {};
            newV.position.x = controlledUnit.position.x - Math.cos(controlledUnit.rotation) * MOVE_SPEED * delta;
            newV.position.y = controlledUnit.position.y - Math.sin(controlledUnit.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["right"]) {
            newV.position = newV.position || {};
            newV.position.x = controlledUnit.position.x + Math.cos(controlledUnit.rotation) * MOVE_SPEED * delta;
            newV.position.y = controlledUnit.position.y + Math.sin(controlledUnit.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["rotateLeft"]) {
            newV.rotation = controlledUnit.rotation - ROTATION_SPEED * delta;
        }
        if (controls.pressed["rotateRight"]) {
            newV.rotation = controlledUnit.rotation + ROTATION_SPEED * delta;
        }

        if (newV.rotation || newV.position) {
            this.emit("moveUnit", {
                unit: controlledUnit,
                position: newV.position || controlledUnit.position,
                rotation: newV.rotation || controlledUnit.rotation,
            });
        }
    }

    rotate(rad, {controlledUnit}) {
        this.emit("moveUnit", {
            unit: controlledUnit,
            rotation: controlledUnit.rotation + rad
        });
    }
}

decorateWithEvents(UiActionGenerator);

export default UiActionGenerator;
