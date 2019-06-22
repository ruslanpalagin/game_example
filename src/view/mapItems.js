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

const initSprite = (url, {position, rotation} = {}) => {
    const sprite = new PIXI.Sprite(PIXI.loader.resources[url].texture);
    position && sprite.position.set(position.x, position.y);
    rotation && (sprite.rotation = rotation);
    return sprite;
};

export default {
    load(){
        return new Promise(resolve => {
            PIXI.loader = new PIXI.Loader();
            PIXI.loader
            .add([
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
            ])
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
                const items = [
                    initSprite(treesBurned, {position: {x: -100, y: -650}}),
                    initSprite(treesBurned, {position: {x: 20, y: -670}}),
                    initSprite(treesBurned, {position: {x: -80, y: -730}}),
                    initSprite(treesBurned, {position: {x: 30, y: -740}}),
                    initSprite(mountain, {position: {x: -130, y: -900}}),
                    initSprite(hills, {position: {x: 240, y: -1200}}),
                    initSprite(hills, {position: {x: -340, y: -1000}}),
                    initSprite(road, {position: {x: 0, y: - 370 * 2}}),

                    initSprite(tree3items, {position: {x: -300, y: -450}}),
                    initSprite(tree3items, {position: {x: 400, y: -250}}),
                    initSprite(tree3items, {position: {x: 20, y: 0}}),
                    initSprite(grass4items, {position: {x: -60, y: 20}}),
                    initSprite(road, {position: {x: 0, y: -370}}),

                    initSprite(hills, {position: {x: -240, y: 150}}),
                    initSprite(lake, {position: {x: -120, y: 210}}),
                    initSprite(tree3items, {position: {x: 80, y: 150}}),
                    initSprite(grass4items, {position: {x: -80, y: 220}}),
                    initSprite(grass4items, {position: {x: -150, y: 270}}),
                    initSprite(road, {position: {x: 0, y: 0}}),
                ];
                resolve({
                    char: initSprite(char),
                    items
                });
            })
        });
    }
};
