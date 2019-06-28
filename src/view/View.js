import find from "lodash/find";
import UiActionGenerator from "./UiActionGenerator";
import ItemsLoader from "./ItemsLoader";

export default class View {
    constructor() {
        this.app = null;
        this.items = [];
        this.worldContainer = null;
        this.centeredUnit = null;
        this.controlledUnit = null;
        this.itemsLoader = new ItemsLoader();
        this.uiActionGenerator = new UiActionGenerator();
    }

    loadAndAddItems(units) {
        return this.itemsLoader.loadSceneObjects(units).then(items => this._addItems(items));
    }

    handleMoveUnit(unit) {
        const item = this._findItem({unitId: unit.id});
        if (unit.position) {
            item.position.set(unit.position.x, unit.position.y);
        }
        if (unit.rotation !== undefined) {
            item.rotation = unit.rotation;
        }
        this._centralize();
    }

    setControlledUnit(unit) {
        this.controlledUnit = unit;
        this._trackCenter(unit);
    }

    resize() {
        this.app.renderer.resize(window.innerWidth - 10, window.innerHeight - 10);
        this._centralize();
    }

    listenToInput(keyMouseActions) {
        this.app.ticker.add(() => {
            this.uiActionGenerator.loop(keyMouseActions, { controlledUnit: this.controlledUnit });
        });
        keyMouseActions.on("rotateCamera", ({rad}) => {
            this.uiActionGenerator.rotate(rad, { controlledUnit: this.controlledUnit });
        });
        keyMouseActions.on("resize", () => this.resize());
    }

    _trackCenter(unit) {
        this.centeredUnit = unit;
    }

    _centralize() {
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

    _addItems(items) {
        this.items = items;
        items.forEach(item => this.worldContainer.addChild(item));
    }

    _findItem(q) {
        return find(this.items, q);
    }
};
