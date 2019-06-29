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
        return PIXI.loader.resources[url].texture;
    }
}

export default Loader;
