import find from "lodash/find";
import PIXI from "src/vendor/PIXI.js";
import UiActionGenerator from "./UiActionGenerator";
import ItemsFactory from "./ItemsFactory";
import Animator from "./Animator";

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
        this.animator = new Animator();
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

    loadAndAddItemsToStage(units) {
        return this.itemsFactory.createFromUnits(units).then(items => this._addItems(items));
    }

    moveNotControlledUnit(unit) {
        this._moveUnit(unit);
    }

    moveControlledUnit(unit) {
        this._moveUnit(unit);
        this._centralize();
    }

    addNewUnit(unit) {
        this.itemsFactory.createFromUnit(unit)
        .then((item) => {
            this._addNewItem(item);
        });
    }

    _moveUnit(unit) {
        const item = this._findItem({unitId: unit.id});
        if (unit.position) {
            item.position.set(unit.position.x, unit.position.y);
        }
        if (unit.rotation !== undefined) {
            item.rotation = unit.rotation;
        }
    }

    handleSay({ unitId, message }) {
        const unit = this.unitLibrary.findUnit({ id: unitId });
        this.itemsFactory.createFromUnit({
            viewSkin: "messageBox",
            message: `${unitId === this.controlledUnit.id ? "You" : unit.name}: ${message}`,
        })
        .then((text) => {
            text.position.x = unit.position.x;
            text.position.y = unit.position.y;
            this.worldContainer.addChild(text);
            setTimeout(() => {
                this.worldContainer.removeChild(text);
            }, 4000);
        });
    }

    handleHit(action) {
        const item = this._findItem({unitId: action.sourceUnit.id});
        this.animator.animateHit(item);
    }

    handleDebugArea(unit) {
        this.itemsFactory.debugArea(unit).then((item) => {
            this.worldContainer.addChild(item);
            setTimeout(() => this._removeItemAnimated(item), 2000);
        });
    }

    async handleDamageUnit(unit) {
        if (unit.state.isDead) {
            const item = this._findItem({unitId: unit.id});
            const deadMark = await this.itemsFactory.deadMark();
            this.animator.animateCharDeath(item, deadMark);
        }
        console.log("damaged: ", unit.id, unit.state.hp);
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
        this.uiActionGenerator.on("interactWithTooFar", ({ sourceUnit }) => {
            let message = "Oh, it's too far away";
            if (Math.random() > 0.4){
                message = "It's too far..."
            }
            if (Math.random() > 0.7){
                message = "Let's get closer"
            }
            this.handleSay({ unitId: sourceUnit.id, message });
        });
    }

    _setCursor(cursor) {
        this.app.view.style.cursor = cursor
    }

    _trackCenter(unit) {
        this.centeredUnit = unit;
        this._centralize();
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

    _addNewItem(item) {
        this.items.push(item);
        // this.uiActionGenerator.items auto-updated
        this.worldContainer.addChild(item);
    }

    _findItem(q) {
        return find(this.items, q);
    }

    _removeItemAnimated(item) {
        this.worldContainer.removeChild(item);
    }
};
