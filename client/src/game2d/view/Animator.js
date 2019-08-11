import PIXI from "src/vendor/PIXI.js";
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

    animateRangedHit(char, distance, duration = 1000) {
        const projectile = Animator.createTriangle(char.position.x, char.position.y, (char.angle % 360) + 180);
        // console.log(char.position, projectile.position, projectile.getBounds());

        new TWEEN.Tween(projectile)
        .to({
            x: projectile.position.x + Math.cos(char.rotation - Math.PI / 2) * distance,
            y: projectile.position.y + Math.sin(char.rotation - Math.PI / 2) * distance,
        }, duration)
        // .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete((tweensTarget) => {
            tweensTarget.parent.removeChild(tweensTarget);
        })
        .start();
        return projectile;
    }

    animateCharDeath(char, deadMark){
        char.addChild(deadMark);
        let line = new PIXI.Graphics();
        line.lineStyle(1, 0xFF0000, 1);
        line.moveTo(0, 0);
        line.lineTo(15, 15);
        line.moveTo(15, 0);
        line.lineTo(0, 15);
        line.x = 0;
        line.y = 0;
        char.addChild(line);

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

    static createTriangle(xPos, yPos, angle = 0) {
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

export default Animator;
