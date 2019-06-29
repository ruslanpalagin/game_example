import find from "lodash/find";
import PIXI from "src/vendor/PIXI.js";
import UiActionGenerator from "./UiActionGenerator";
import ItemsFactory from "src/view/ItemsFactory";

export default class View {
    constructor() {
        this.app = null;
        this.items = [];
        this.worldContainer = null;
        this.centeredUnit = null;
        this.controlledUnit = null;
        this.itemsFactory = new ItemsFactory();
        this.uiActionGenerator = new UiActionGenerator();
        this.unitLibrary = null;
    }

    setUnitLibrary(unitLibrary) {
        this.unitLibrary = unitLibrary;
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
        return this.itemsFactory.createFromUnits(units).then(items => this._addItems(items));
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
        const unit = this.unitLibrary.findUnit({ id: unitId });
        const text = this.itemsFactory.createFromUnit({
            viewSkin: "messageBox",
            message: `${unitId === this.controlledUnit.id ? "You" : unit.name}: ${message}`,
        });
        text.position.x = unit.position.x;
        text.position.y = unit.position.y;
        this.worldContainer.addChild(text);
        setTimeout(() => {
            this.worldContainer.removeChild(text);
        }, 4000);
        console.log("{ unitId, message }", { unitId, message });
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
        this.uiActionGenerator.on("interactWithTooFar", ({ source }) => {
            let message = "Oh, it's too far away";
            if (Math.random() > 0.4){
                message = "It's too far..."
            }
            if (Math.random() > 0.7){
                message = "Let's get closer"
            }
            this.handleSay({ unitId: source.unitId, message });
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
