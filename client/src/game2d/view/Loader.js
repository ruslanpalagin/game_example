import PIXI from "src/vendor/PIXI.js";
import char from "./textures/char.png";
import grass1 from "./textures/grass1.png";
import grass4items from "./textures/grass4items.png";
import hills from "./textures/hills.png";
import mountain from "./textures/mountain.png";
import road from "./textures/road.png";
import tree3items from "./textures/tree3items.png";
import treeApple from "./textures/treeApple.png";
import treesBurned from "./textures/treesBurned.png";
import lake from "./textures/lake.png";

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

class Loader {
    async loadTextures(){
        return new Promise(resolve => {
            PIXI.loader = PIXI.loader || new PIXI.Loader();
            PIXI.loader
            .add(Object.values(typesMap))
            .load(() => {
                resolve();
            })
        });
    }

    getTexture(viewSkin) {
        const url = typesMap[viewSkin];
        return url ? PIXI.loader.resources[url].texture : null;
    }
}

export default Loader;
