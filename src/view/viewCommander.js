export default {
    drawChar(char, newV) {
        newV.position && char.position.set(newV.position.x, newV.position.y);
        newV.rotation && (char.rotation = newV.rotation);
    },
    rotateCamera(view, rad) {
        view.char.rotation += rad;
    }
};
