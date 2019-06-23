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
            { viewSkin: "treesBurned", position: {x: -100, y: -650} },
            { viewSkin: "treesBurned", position: {x: 20, y: -670} },
            { viewSkin: "treesBurned", position: {x: -80, y: -730} },
            { viewSkin: "treesBurned", position: {x: 30, y: -740} },
            { viewSkin: "mountain", position: {x: -130, y: -900} },
            { viewSkin: "hills", position: {x: 240, y: -1200} },
            { viewSkin: "hills", position: {x: -340, y: -1000} },
            { viewSkin: "road", position: {x: 0, y: - 370 * 2} },

            { viewSkin: "tree3items", position: {x: -300, y: -450} },
            { viewSkin: "tree3items", position: {x: 400, y: -250} },
            { viewSkin: "tree3items", position: {x: 20, y: 0} },
            { viewSkin: "grass4items", position: {x: -60, y: 20} },
            { viewSkin: "road", position: {x: 0, y: -370} },

            { viewSkin: "hills", position: {x: -240, y: 150} },
            { viewSkin: "lake", position: {x: -120, y: 210} },
            { viewSkin: "tree3items", position: {x: 80, y: 150} },
            { viewSkin: "grass4items", position: {x: -80, y: 220} },
            { viewSkin: "grass4items", position: {x: -150, y: 270} },
            { viewSkin: "road", position: {x: 0, y: 0} },

            { viewSkin: "char", id: 1, accountId: 1, position: { x: 0, y: 350 }, rotation: 0.5 },
            { viewSkin: "char", id: 2, accountId: 2, position: { x: 220, y: 0 }, rotation: 3.5 },
        ];
        this.state.units = units;

        return Promise.resolve(units);
    }
}

export default WorldState;
