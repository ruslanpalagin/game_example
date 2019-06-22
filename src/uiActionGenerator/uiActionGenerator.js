import decorateWithEvents from "src/utils/decorateWithEvents";

export default decorateWithEvents({
    lastLoopTime: null,
    loop(controls, {char}) {
        this.lastLoopTime = this.lastLoopTime || (new Date()).getTime();
        const MOVE_SPEED = 60;
        const ROTATION_SPEED = 3;
        const newV = {};
        const currentTime = (new Date()).getTime();
        const delta = (currentTime - this.lastLoopTime) / 1000;
        this.lastLoopTime = currentTime;
        if (controls.pressed["up"]) {
            newV.position = newV.position || {};
            newV.position.x = char.position.x + Math.sin(char.rotation) * MOVE_SPEED * delta;
            newV.position.y = char.position.y - Math.cos(char.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["down"]) {
            newV.position = newV.position || {};
            newV.position.x = char.position.x - Math.sin(char.rotation) * MOVE_SPEED * delta;
            newV.position.y = char.position.y + Math.cos(char.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["left"]) {
            newV.position = newV.position || {};
            newV.position.x = char.position.x - Math.cos(char.rotation) * MOVE_SPEED * delta;
            newV.position.y = char.position.y - Math.sin(char.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["right"]) {
            newV.position = newV.position || {};
            newV.position.x = char.position.x + Math.cos(char.rotation) * MOVE_SPEED * delta;
            newV.position.y = char.position.y + Math.sin(char.rotation) * MOVE_SPEED * delta;
        }
        if (controls.pressed["rotateLeft"]) {
            newV.rotation = char.rotation - ROTATION_SPEED * delta;
        }
        if (controls.pressed["rotateRight"]) {
            newV.rotation = char.rotation + ROTATION_SPEED * delta;
        }

        this.emit("newChar", newV);
    },
});
