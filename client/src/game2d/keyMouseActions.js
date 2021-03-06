import decorateWithEvents from "src/../../core/utils/decorateWithEvents";

const CAMERA_X_PX_PER_RAD = 200;

export default decorateWithEvents({
    sub(window) {
        window.addEventListener( "keydown", (e) => this.keyDown(e), false );
        window.addEventListener( "keyup", (e) => this.keyUp(e), false );
        window.addEventListener( "contextmenu", (e) => this.contextmenu(e), false );
        window.addEventListener( "mousedown", (e) => this.mouseDown(e), false );
        window.addEventListener( "mouseup", (e) => this.mouseUp(e), false );
        window.addEventListener( "mousemove", (e) => this.mouseMove(e), false );
        window.addEventListener( "resize", () => this.emit("resize"), false );
    },
    pressed: {},
    cameraRotationMouseMoveHistory: null,
    down(name){
        if (!this.pressed[name]) {
            this.emit("start", { name });
        }
        this.pressed[name] = true;
    },
    up(name){
        if (this.pressed[name]) {
            this.emit("stop", { name });
        }
        this.pressed[name] = false;
    },
    keyDown(key) {
        // W Key is 87
        // Up arrow is 38
        if (key.keyCode === 87 || key.keyCode === 38) {
            this.down("up");
        }

        // S Key is 83
        //  arrow is 40
        if (key.keyCode === 83 || key.keyCode === 40) {
            this.down("down");
        }

        // A Key is 65
        if (key.keyCode === 65) {
            this.down("left");
        }

        // D Key is 68
        if (key.keyCode === 68) {
            this.down("right");
        }

        // q 81 ; left 37
        if (key.keyCode === 81 || key.keyCode === 37) {
            this.down("rotateLeft");
        }

        // e 69 ; right 39
        if (key.keyCode === 69 || key.keyCode === 39) {
            this.down("rotateRight");
        }

        // ability keys
        if (key.keyCode >= 48 && key.keyCode <= 58) {
            this.emit("abilityKey", { slot: key.keyCode - 48 });
        }
        // console.log("down key.keyCode", key.keyCode);
    },
    keyUp(key) {
        // W Key is 87
        //  arrow is 38
        if (key.keyCode === 87 || key.keyCode === 38) {
            this.up("up");
        }

        // S Key is 83
        //  arrow is 40
        if (key.keyCode === 83 || key.keyCode === 40) {
            this.up("down");
        }

        // A Key is 65
        if (key.keyCode === 65) {
            this.up("left");
        }

        // D Key is 68
        if (key.keyCode === 68) {
            this.up("right");
        }

        // q 81 ; left 37
        if (key.keyCode === 81 || key.keyCode === 37) {
            this.up("rotateLeft");
        }

        // e 69 ; right 39
        if (key.keyCode === 69 || key.keyCode === 39) {
            this.up("rotateRight");
        }

        // console.log("up key.keyCode", key.keyCode);
    },
    mouseDown(e) {
        if (e.button === 0 && this.pressed["mouseRightButton"]) {
            this.down("up");
        }
        if (e.button === 2) {
            this.down("mouseRightButton");
            this.cameraRotationMouseMoveHistory = { pageX: e.pageX, pageY: e.pageY };
        }
    },
    mouseUp(e) {
        if (e.button === 0) {
            this.up("up");
        }
        if (e.button === 2) {
            this.up("mouseRightButton");
            this.cameraRotationMouseMoveHistory = null;
        }
        if (e.button === 0) {
            this.emit("mouseLeftClick", { x: e.pageX, y: e.pageY });
        }
        if (e.button === 2) {
            this.emit("mouseRightClick", { x: e.pageX, y: e.pageY });
        }
    },
    contextmenu(e) {
        e.preventDefault();
        return false;
    },
    mouseMove(e) {
        const point = { x: e.pageX, y: e.pageY };
        if (this.pressed["mouseRightButton"]) {
            const diff = point.x - this.cameraRotationMouseMoveHistory.pageX;
            const rad = diff / CAMERA_X_PX_PER_RAD * Math.PI;
            this.emit("rotateCamera", {rad});
            this.cameraRotationMouseMoveHistory = { pageX: point.x, pageY: point.y };
        }
        this.emit("mouseMove", point);
    },
});
