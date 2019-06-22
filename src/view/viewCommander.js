export default {
    drawChar(view, newV) {
        const { char } = view;
        newV.position && char.position.set(newV.position.x, newV.position.y);
        newV.rotation && (char.rotation = newV.rotation);

        this.centralize(view);
    },
    rotateCamera(view, rad) {
        view.char.rotation += rad;
    },
    centralize(view) {
        const { worldContainer, char } = view;
        const xOffset = window.innerWidth / 2;
        const yOffset = window.innerHeight / 2;
        worldContainer.position.set(xOffset - char.position.x, yOffset - char.position.y);
    },
    resize(view) {
        view.app.renderer.resize(window.innerWidth - 10, window.innerHeight - 10);
        this.centralize(view);
    }
};
