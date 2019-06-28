import find from "lodash/find";
import PIXI from "src/vendor/PIXI.js";
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

    createCanvas(document, {elId}) {
        this.app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: true, // default: false
            resolution: 1       // default: 1
        });
        document.getElementById(elId).appendChild(this.app.view);
        this.worldContainer = new PIXI.Container();
        this.uiActionGenerator.worldContainer = this.worldContainer;
        this.app.stage.addChild(this.worldContainer);
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

    handleSay({ unitId, message }) {
        console.log("{ unitId, message }", { unitId, message });
        alert(`${unitId === this.controlledUnit.id ? "You" : unitId}: ${message}`);
    }

    setControlledUnit(unit) {
        this.controlledUnit = unit;
        this.uiActionGenerator.controlledUnit = unit;
        this._trackCenter(unit);
    }

    resize() {
        this.app.renderer.resize(window.innerWidth - 10, window.innerHeight - 10);
        this._centralize();
    }

    listenToInput(keyMouseActions) {
        this.app.ticker.add(() => this.uiActionGenerator.loop(keyMouseActions));
        this.uiActionGenerator.listenToInput(keyMouseActions);
        keyMouseActions.on("resize", () => this.resize());
        this.uiActionGenerator.on("mouseIn", () => this._setCursor("pointer"));
        this.uiActionGenerator.on("mouseOut", () => this._setCursor(null));
        this.uiActionGenerator.on("interactWithTooFar", ({ source, target }) => {
            this.handleSay({ unitId: source.unitId, message: `Oh, ${target.unitId} is too far...` });
        });
    }

    _setCursor(cursor) {
        this.app.view.style.cursor = cursor
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
        this.uiActionGenerator.items = items;
        items.forEach(item => this.worldContainer.addChild(item));
    }

    _findItem(q) {
        return find(this.items, q);
    }
};
