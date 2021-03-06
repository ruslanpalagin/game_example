import PIXI from "src/vendor/PIXI.js";
import Loader from "./Loader";

export default class ItemsFactory{

    constructor(){
        this.loader = new Loader();
    }

    async createFromUnit(unit) {
        const factoryMethod = this[unit.viewSkin] ? unit.viewSkin : "mapItem";
        return this[factoryMethod](unit).then((item) => {
            item.behaviors = {
                isInteractive: unit.isInteractive,
                canBeTarget: unit.canBeTarget,
            };
            return item;
        })
    }

    async createFromUnits(units) {
        return this.loader.loadTextures(units)
        .then(() => {
            const promises = units.map((unit) => this.createFromUnit(unit));
            return Promise.all(promises);
        });
    }

    // factory methods

    async debugPoint(unit) {
        const g = new PIXI.Graphics();
        g.beginFill(0xFF0000);
        g.drawCircle(0, 0, 2);
        g.endFill();
        unit.position && g.position.set(unit.position.x, unit.position.y);
        unit.rotation && (g.rotation = unit.rotation);
        return g;
    }

    async debugArea(area) {
        const g = new PIXI.Graphics();
        g.beginFill(0xFF0000);
        g.drawCircle(0, 0, area.radius);
        g.endFill();
        g.beginHole();
        g.drawCircle(0, 0, area.radius - 2);
        g.endHole();
        area.position && g.position.set(area.position.x, area.position.y);
        area.rotation && (g.rotation = area.rotation);
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
        const body = new PIXI.Sprite(this.loader.getTexture("char"));
        body.position.set(0, 0);

        const weapon = new PIXI.Graphics();
        weapon.beginFill(0x888888);
        weapon.drawRect(0, 0, 2, 20);
        weapon.endFill();
        weapon.position.set(18, 12);
        weapon.pivot.set(0, 20);

        const container = new PIXI.Container();
        container.unitId = unit.id;
        container.isInteractive = unit.isInteractive;
        unit.position && container.position.set(unit.position.x, unit.position.y);
        unit.rotation && (container.rotation = unit.rotation);
        container.pivot.set(10, 10);

        container.addChild(body);
        container.body = body;
        container.addChild(weapon);
        container.weapon = weapon;

        if (unit.state.isDead) {
            const deadMark = await this.deadMark();
            container.addChild(deadMark);
        }

        return container;
    }

    async charBandit(unit) {
        const body = new PIXI.Sprite(this.loader.getTexture("char"));
        body.position.set(0, 0);

        const weapon = new PIXI.Graphics();
        weapon.beginFill(0xFF0000);
        weapon.drawRect(0, 0, 2, 20);
        weapon.endFill();
        weapon.position.set(18, 12);
        weapon.pivot.set(0, 20);

        const container = new PIXI.Container();
        container.unitId = unit.id;
        container.isInteractive = unit.isInteractive;
        unit.position && container.position.set(unit.position.x, unit.position.y);
        unit.rotation && (container.rotation = unit.rotation);
        container.pivot.set(10, 10);

        container.addChild(body);
        container.body = body;
        container.addChild(weapon);
        container.weapon = weapon;

        if (unit.state.isDead) {
            const deadMark = await this.deadMark();
            container.addChild(deadMark);
        }

        return container;
    }

    async charMad(unit) {
        const body = new PIXI.Sprite(this.loader.getTexture("char"));
        body.position.set(0, 0);

        const container = new PIXI.Container();
        container.unitId = unit.id;
        container.isInteractive = unit.isInteractive;
        unit.position && container.position.set(unit.position.x, unit.position.y);
        unit.rotation && (container.rotation = unit.rotation);
        container.pivot.set(10, 10);

        container.addChild(body);
        container.body = body;

        if (unit.state.isDead) {
            const deadMark = await this.deadMark();
            container.addChild(deadMark);
        }

        return container;
    }

    async messageBox({message}){
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
        container.pivot.y = 120;
        container.alpha = 0.8;

        return container;
    }

    async deadMark() {
        let line = new PIXI.Graphics();
        line.lineStyle(1, 0xFF0000, 1);
        line.moveTo(0, 0);
        line.lineTo(15, 15);
        line.moveTo(15, 0);
        line.lineTo(0, 15);
        line.x = 0;
        line.y = 0;
        return line;
    }

    grenade(xPos, yPos, angle = 0) {
        const color = 0xCC3300;

        const graphics = new PIXI.Graphics()
            .beginFill(color, 1)
            .drawStar(0, 0, 4, 7)
            .endFill();
        graphics.x = xPos;
        graphics.y = yPos;
        graphics.angle = angle;

        return graphics;
    }

    createTriangle(xPos, yPos, angle = 0) {
        const color = 0xff6600;

        const triangleWidth = 5,
            triangleHeight = 15,
            triangleHalfway = triangleWidth / 2;

        // draw triangle 
        const triangle = new PIXI.Graphics()
        .beginFill(color, 1)
        .lineStyle(0, color, 1)
        .moveTo(triangleWidth, 0)
        .lineTo(triangleHalfway, triangleHeight)
        .lineTo(0, 0)
        .lineTo(triangleWidth, 0)
        .endFill();

        triangle.x = xPos;
        triangle.y = yPos;
        triangle.pivot.set(triangleHalfway, triangleHeight / 2);
        triangle.angle = angle;

        return triangle;
    }
}
