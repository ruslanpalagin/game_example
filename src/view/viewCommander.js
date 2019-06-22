export default {
    draw(char, newV) {
        newV.position && char.position.set(newV.position.x, newV.position.y);
        newV.rotation && (char.rotation = newV.rotation);
    },
};
