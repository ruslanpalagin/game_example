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
        keyMouseActions.on("abilityKey", ({slot}) => {
            this.emit("useAbility", { slot, sourceUnit: this.controlledUnit, name: "useAbility" });
        });
    }

    loop(controls) {
        const controlledUnit = this.controlledUnit;
        this.lastLoopTime = this.lastLoopTime || (new Date()).getTime();
        const MOVE_SPEED = 90;
        const ROTATION_SPEED = 3;
        const newV = {
            position: { x: controlledUnit.position.x, y: controlledUnit.position.y },
            rotation: controlledUnit.rotation,
        };
        const currentTime = (new Date()).getTime();
        const delta = (currentTime - this.lastLoopTime) / 1000;
        this.lastLoopTime = currentTime;
        if (controls.pressed["up"]) {
            newV.position = newV.position || {};
            newV.position.x = newV.position.x + Math.sin(newV.rotation) * MOVE_SPEED * delta;
            newV.position.y = newV.position.y - Math.cos(newV.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["down"]) {
            newV.position = newV.position || {};
            newV.position.x = newV.position.x - Math.sin(newV.rotation) * MOVE_SPEED/2 * delta;
            newV.position.y = newV.position.y + Math.cos(newV.rotation) * MOVE_SPEED/2 * delta;
        }
        if (controls.pressed["left"]) {
            newV.position = newV.position || {};
            newV.position.x = newV.position.x - Math.cos(newV.rotation) * MOVE_SPEED/2 * delta;
            newV.position.y = newV.position.y - Math.sin(newV.rotation) * MOVE_SPEED/2 * delta;
        }
        if (controls.pressed["right"]) {
            newV.position = newV.position || {};
            newV.position.x = newV.position.x + Math.cos(newV.rotation) * MOVE_SPEED/2 * delta;
            newV.position.y = newV.position.y + Math.sin(newV.rotation) * MOVE_SPEED/2 * delta;
        }
        if (controls.pressed["rotateLeft"]) {
            newV.rotation = newV.rotation - ROTATION_SPEED * delta;
        }
        if (controls.pressed["rotateRight"]) {
            newV.rotation = newV.rotation + ROTATION_SPEED * delta;
        }

        if (
            newV.rotation !== controlledUnit.rotation ||
            newV.position.x !== controlledUnit.position.x ||
            newV.position.y !== controlledUnit.position.y
        ) {
            this.emit("moveUnit", {
                name: "moveUnit",
                unitId: controlledUnit.id,
                uPoint: {
                    position: newV.position,
                    rotation: newV.rotation,
                },
            });
        }
    }

    rotate(rad) {
        this.emit("moveUnit", {
            name: "moveUnit",
            unitId: this.controlledUnit.id,
            uPoint: { rotation: this.controlledUnit.rotation + rad }
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
                name: "interactWith",
                sourceUnit: { id: this.controlledUnit.id },
                targetUnit: { id: clickedItem.unitId },
            });
        } else {
            this.emit("interactWithTooFar", {
                name: "interactWithTooFar",
                sourceUnit: { id: this.controlledUnit.id },
                targetUnit: { id: clickedItem.unitId },
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

    // TODO use collisions
    calcRangeToBorder(controlledUnit, clickedItem) {
        const xDiff = Math.abs(controlledUnit.position.x - clickedItem.position.x);
        const yDiff = Math.abs(controlledUnit.position.y - clickedItem.position.y);
        return Math.sqrt( xDiff * xDiff + yDiff * yDiff );
    }
}

decorateWithEvents(UiActionGenerator);

export default UiActionGenerator;
