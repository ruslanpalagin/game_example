// import PIXI from "src/vendor/PIXI.js";
const TWEEN = require('@tweenjs/tween.js');

setInterval(() => {
    TWEEN.update();
}, 30);

class Animator {
    animateHit(char){
        char.weapon.animationReset = char.weapon.animationReset || {
            rotation: char.weapon.rotation,
                position: char.weapon.position.clone(),
            };
        const main = {
            rotation: char.weapon.rotation,
            x: char.weapon.position.x,
            y: char.weapon.position.y,
        };
        new TWEEN.Tween(main)
        .to({
            rotation: [char.weapon.animationReset.rotation + 0.5, char.weapon.animationReset.rotation - 1, char.weapon.animationReset.rotation],
            x: [char.weapon.animationReset.position.x + 5, char.weapon.animationReset.position.x - 5, char.weapon.animationReset.position.x],
            y: [char.weapon.animationReset.position.y - 10, char.weapon.animationReset.position.y],
        }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            char.weapon.rotation = main.rotation;
            char.weapon.position.x = main.x;
            char.weapon.position.y = main.y;
        })
        .start();
    }

    animateCharDeath(char, deadMark){
        char.addChild(deadMark);
        const main = {
            x: char.weapon.position.x,
            rotation: char.weapon.rotation,
        };
        new TWEEN.Tween(main)
        .to({
            x: [main.x + 15],
            rotation: [main.rotation + Math.PI / 6],
        }, 2500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            char.weapon.position.x = main.x;
            char.weapon.rotation = main.rotation;
        })
        .start();
    }
}

export default Animator;
