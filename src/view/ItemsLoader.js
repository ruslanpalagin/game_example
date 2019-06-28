import PIXI from "src/vendor/PIXI.js";
import char from "src/textures/char.png";
import grass1 from "src/textures/grass1.png";
import grass4items from "src/textures/grass4items.png";
import hills from "src/textures/hills.png";
import mountain from "src/textures/mountain.png";
import road from "src/textures/road.png";
import tree3items from "src/textures/tree3items.png";
import treeApple from "src/textures/treeApple.png";
import treesBurned from "src/textures/treesBurned.png";
import lake from "src/textures/lake.png";

const typesMap = {
    char,
    grass1,
    grass4items,
    hills,
    mountain,
    road,
    tree3items,
    treeApple,
    treesBurned,
    lake,
};

const initSprite = (unit) => {
    const url = typesMap[unit.viewSkin];
    const sprite = new PIXI.Sprite(PIXI.loader.resources[url].texture);
    sprite.unitId = unit.id;
    sprite.isInteractive = unit.isInteractive;
    unit.position && sprite.position.set(unit.position.x, unit.position.y);
    unit.rotation && (sprite.rotation = unit.rotation);
    if (unit.viewSkin === "char") {
        sprite.anchor.set(0.5, 0.5);
    }
    return sprite;
};

class ItemsLoader {
    loadSceneObjects(units){
        return new Promise(resolve => {
            PIXI.loader = PIXI.loader || new PIXI.Loader();
            PIXI.loader
            .add(Object.values(typesMap))
            // .on("progress", (loader, resource) => {
            //     //Display the file `url` currently being loaded
            //     console.log("loading: " + resource.url);
            //     //Display the percentage of files currently loaded
            //     console.log("progress: " + loader.progress + "%");
            //     //If you gave your files names as the first argument
            //     //of the `add` method, you can access them like this
            //     //console.log("loading: " + resource.name);
            // })
            .load(() => {
                const items = units.map((stateItemData) => initSprite(stateItemData));
                resolve(items);
            })
        });
    }

    createMessageItem(message) {
        const style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "white",
            stroke: '#333333',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#eeeeee",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });
        const text = new PIXI.Text(message, style);
        text.pivot.x = text.width / 2;
        text.pivot.y = 50;

        return text;
    }
}

export default ItemsLoader;
