import decorateWithEvents from "src/../../core/utils/decorateWithEvents";
import collisions from "src/../../core/utils/collisions.js";

const MAX_INTRACTION_RANGE = 100;

class UiActionGenerator {
    constructor() {
        this.lastLoopTime = null;
        this.controlledUnit = null;
        this.hoveredUnit = null;
        this.worldContainer = null;
        this.items = null;
    }

    setItems(items){
        this.items = items;
        this.interactiveItems = items.filter((item) => item.behaviors.isInteractive);
        this.targetableItems = items.filter((item) => item.behaviors.canBeTarget);
    }

    listenToInput(keyMouseActions) {
        keyMouseActions.on("rotateCamera", ({rad}) => {
            if (!this._isUnitActive(this.controlledUnit)){
                return;
            }
            this._rotate(rad);
        });
        keyMouseActions.on("mouseLeftClick", (position) => {
            if (!this.controlledUnit){
                return;
            }
            const worldPoint = this.worldContainer.toLocal(position);
            this._testTarget(worldPoint);
        });
        keyMouseActions.on("mouseRightClick", (position) => {
            if (!this.controlledUnit){
                return;
            }
            const worldPoint = this.worldContainer.toLocal(position);
            this._testInteraction(worldPoint);
        });
        keyMouseActions.on("mouseMove", (position) => {
            if (!this.controlledUnit){
                return;
            }
            const worldPoint = this.worldContainer.toLocal(position);
            this._testHover(worldPoint);
        });
        keyMouseActions.on("abilityKey", ({slot}) => {
            if (!this._isUnitActive(this.controlledUnit)){
                return;
            }
            this.emit("useAbility", { slot });
        });
    }

    loop(controls) {
        if (this._isUnitActive(this.controlledUnit)) {
            this._checkMoveAndRotate(controls);
        }
    }

    _isUnitActive(unit) {
        return unit && !unit.state.isDead;
    }

    _checkMoveAndRotate(controls){
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
            newV.position.x = newV.position.x - Math.sin(newV.rotation) * MOVE_SPEED * 0.6 * delta;
            newV.position.y = newV.position.y + Math.cos(newV.rotation) * MOVE_SPEED * 0.6 * delta;
        }
        if (controls.pressed["left"]) {
            newV.position = newV.position || {};
            newV.position.x = newV.position.x - Math.cos(newV.rotation) * MOVE_SPEED * 0.9 * delta;
            newV.position.y = newV.position.y - Math.sin(newV.rotation) * MOVE_SPEED * 0.9 * delta;
        }
        if (controls.pressed["right"]) {
            newV.position = newV.position || {};
            newV.position.x = newV.position.x + Math.cos(newV.rotation) * MOVE_SPEED * 0.9 * delta;
            newV.position.y = newV.position.y + Math.sin(newV.rotation) * MOVE_SPEED * 0.9 * delta;
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
                unitId: this.controlledUnit.id,
                uPoint: {
                    position: newV.position,
                    rotation: newV.rotation,
                },
            });
        }
    }

    _rotate(rad) {
        this.emit("moveUnit", {
            name: "moveUnit",
            unitId: this.controlledUnit.id,
            uPoint: { rotation: this.controlledUnit.rotation + rad }
        });
    }

    _testTarget(worldPosition) {
        const clickedItem = collisions.findItemByPoint(this.targetableItems, worldPosition);
        if (!clickedItem) {
            return;
        }
        this.emit("targetItem", clickedItem);
    }

    _testInteraction(worldPosition) {
        const clickedItem = collisions.findItemByPoint(this.interactiveItems, worldPosition);
        if (!clickedItem) {
            return;
        }
        const range = collisions.getDistance(this.controlledUnit, clickedItem);
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

    _testHover(worldPoint) {
        const hoveredItem = collisions.findItemByPoint(this.interactiveItems, worldPoint);
        if (this.hoveredUnit && !hoveredItem) {
            this.emit("mouseOut", this.hoveredUnit);
            this.hoveredUnit = null;
        }
        if (!this.hoveredUnit && hoveredItem) {
            this.hoveredUnit = hoveredItem;
            this.emit("mouseIn", this.hoveredUnit);
        }
    }
}

decorateWithEvents(UiActionGenerator);

export default UiActionGenerator;
