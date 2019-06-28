import find from "lodash/find";

class WorldState {
    constructor() {
        this.state = {
            units: [],
        };
    }

    setState(state) {
        this.state = Object.assign(this.state, state);
    }

    findUnit(q) {
        return find(this.state.units, q);
    }

    updUnitById(id, props) {
        const unit = this.findUnit({id});
        Object.assign(unit, props);
        return unit;
    }

    loadSave() {
        const units = [
            { id: 3, viewSkin: "treesBurned", position: {x: -100, y: -650} },
            { id: 4, viewSkin: "treesBurned", position: {x: 20, y: -670} },
            { id: 5, viewSkin: "treesBurned", position: {x: -80, y: -730} },
            { id: 6, viewSkin: "treesBurned", position: {x: 30, y: -740} },
            { id: 7, viewSkin: "mountain", position: {x: -130, y: -900} },
            { id: 8, viewSkin: "hills", position: {x: 240, y: -1200} },
            { id: 9, viewSkin: "hills", position: {x: -340, y: -1000} },
            { id: 10, viewSkin: "road", position: {x: 0, y: - 370 * 2} },

            { id: 11, viewSkin: "tree3items", position: {x: -300, y: -450} },
            { id: 12, viewSkin: "tree3items", position: {x: 400, y: -250} },
            { id: 13, viewSkin: "tree3items", position: {x: 20, y: 0} },
            { id: 14, viewSkin: "grass4items", position: {x: -60, y: 20} },
            { id: 15, viewSkin: "road", position: {x: 0, y: -370} },

            { id: 16, viewSkin: "hills", position: {x: -240, y: 150} },
            { id: 17, viewSkin: "lake", position: {x: -120, y: 210}, isInteractive: true },
            { id: 18, viewSkin: "tree3items", position: {x: 80, y: 150} },
            { id: 19, viewSkin: "grass4items", position: {x: -80, y: 220} },
            { id: 20, viewSkin: "grass4items", position: {x: -150, y: 270} },
            { id: 21, viewSkin: "road", position: {x: 0, y: 0} },

            { id: 1, viewSkin: "char", accountId: 1, position: { x: 0, y: 350 }, rotation: 0.5, isInteractive: true },
            { id: 2, viewSkin: "char", accountId: 2, position: { x: 220, y: 0 }, rotation: 3.5, isInteractive: true },
        ];
        this.state.units = units;

        return Promise.resolve(units);
    }
}

export default WorldState;
