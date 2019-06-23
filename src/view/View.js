import find from "lodash/find";

export default class View {
    constructor() {
        this.app = null;
        this.items = [];
        this.worldContainer = null;
        this.centeredUnit = null;
    }

    handleMoveUnit(unit) {
        const item = this.findItem({unitId: unit.id});
        unit.position && item.position.set(unit.position.x, unit.position.y);
        unit.rotation !== undefined && (item.rotation = unit.rotation);
        this.centralize();
    }

    trackCenter(unit) {
        this.centeredUnit = unit;
    }

    centralize() {
        if (!this.centeredUnit) {
            return;
        }
        const xOffset = window.innerWidth / 2;
        const yOffset = window.innerHeight / 2;
        this.worldContainer.position.set(
            xOffset - this.centeredUnit.position.x,
            yOffset - this.centeredUnit.position.y,
        );
    }

    resize() {
        this.app.renderer.resize(window.innerWidth - 10, window.innerHeight - 10);
        this.centralize();
    }

    addItems(items) {
        this.items = items;
        items.forEach(item => this.worldContainer.addChild(item));
    }

    findItem(q) {
        return find(this.items, q);
    }
};
