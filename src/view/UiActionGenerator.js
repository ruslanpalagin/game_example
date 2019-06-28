import decorateWithEvents from "src/utils/decorateWithEvents";
import collisions from "src/common/collisions.js";

const MAX_INTRACTION_RANGE = 100;

class UiActionGenerator {
    constructor() {
        this.lastLoopTime = null;
        this.controlledUnit = null;
        this.hoveredUnit = null;
        this.worldContainer = null;
        this.items = null;
    }

    listenToInput(keyMouseActions) {
        keyMouseActions.on("rotateCamera", ({rad}) => {
            this.rotate(rad);
        });
        keyMouseActions.on("mouseRightClick", (e) => {
            const worldPoint = this.worldContainer.toLocal(e);
            this.testInteraction(worldPoint);
        });
        keyMouseActions.on("mouseMove", (e) => {
            const worldPoint = this.worldContainer.toLocal(e);
            this.testHover(worldPoint);
        });
    }

    loop(controls) {
        const controlledUnit = this.controlledUnit;
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

    rotate(rad) {
        this.emit("moveUnit", {
            unit: this.controlledUnit,
            rotation: this.controlledUnit.rotation + rad
        });
    }

    testInteraction(worldPoint) {
        const clickedItem = collisions.findItemByPoint(this.items, worldPoint);
        if (!clickedItem) {
            return;
        }
        const range = this.calcRangeToBorder(this.controlledUnit, clickedItem);
        if (range <= MAX_INTRACTION_RANGE) {
            this.emit("interactWith", {
                source: { unitId: this.controlledUnit.id },
                target: { unitId: clickedItem.unitId },
            });
        } else {
            this.emit("interactWithTooFar", {
                source: { unitId: this.controlledUnit.id },
                target: { unitId: clickedItem.unitId },
            });
        }
    }

    testHover(worldPoint) {
        const hoveredItem = collisions.findItemByPoint(this.items, worldPoint);
        if (this.hoveredUnit && !hoveredItem) {
            this.emit("mouseOut", this.hoveredUnit);
            this.hoveredUnit = null;
        }
        if (!this.hoveredUnit && hoveredItem) {
            this.hoveredUnit = hoveredItem;
            this.emit("mouseIn", this.hoveredUnit);
        }
    }

    calcRangeToBorder(controlledUnit, clickedItem) {
        const xDiff = Math.abs(controlledUnit.position.x - clickedItem.position.x);
        const yDiff = Math.abs(controlledUnit.position.y - clickedItem.position.y);
        return Math.sqrt( xDiff * xDiff + yDiff * yDiff );
    }
}

decorateWithEvents(UiActionGenerator);

export default UiActionGenerator;
