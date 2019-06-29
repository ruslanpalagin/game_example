import PIXI from "src/vendor/PIXI.js";
import Loader from "./Loader";

export default class ItemsFactory{

    constructor(){
        this.loader = new Loader();
    }

    async createFromUnit(unit) {
        return this[unit.viewSkin] ? this[unit.viewSkin](unit) : this.mapItem(unit);
    }

    async createFromUnits(units) {
        return this.loader.loadTextures(units)
        .then(() => {
            const promises = units.map((unit) => this.createFromUnit(unit));
            return Promise.all(promises);
        });
    }

    // factory methods

    async helperPoint(unit) {
        const g = new PIXI.Graphics();
        g.beginFill(0xFF0000);
        g.drawCircle(0, 0, 2);
        g.endFill();
        unit.position && g.position.set(unit.position.x, unit.position.y);
        unit.rotation && (g.rotation = unit.rotation);
        return g;
    }

    async mapItem(unit) {
        const texture = this.loader.getTexture(unit.viewSkin);
        const sprite = new PIXI.Sprite(texture);
        sprite.unitId = unit.id;
        sprite.isInteractive = unit.isInteractive;
        unit.position && sprite.position.set(unit.position.x, unit.position.y);
        unit.rotation && (sprite.rotation = unit.rotation);
        return sprite;
    }

    async char(unit) {
        const texture = this.loader.getTexture(unit.viewSkin);
        const sprite = new PIXI.Sprite(texture);
        sprite.unitId = unit.id;
        sprite.isInteractive = unit.isInteractive;
        unit.position && sprite.position.set(unit.position.x, unit.position.y);
        unit.rotation && (sprite.rotation = unit.rotation);
        sprite.anchor.set(0.5, 0.5);
        return sprite;
    }

    async messageTooltip({message}){
        const container = new PIXI.Container();

        const rectangle = new PIXI.Graphics();
        rectangle.lineStyle(4, 0x333333, 1);
        rectangle.beginFill(0xFFFFFF);
        rectangle.drawRoundedRect(0, 0, 200, 30, 5);
        rectangle.endFill();

        const style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "#000000",
        });
        const text = new PIXI.Text(message, style);
        text.position.set(7, 5);

        container.addChild(rectangle);
        container.addChild(text);

        container.pivot.x = container.width / 2;
        container.pivot.y = 50;

        return container;
    }
}
