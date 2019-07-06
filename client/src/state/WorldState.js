import find from "lodash/find";
import filter from "lodash/filter";
import UnitLibrary from "./UnitLibrary.js";

class WorldState {
    constructor() {
        this.state = {
            units: [],
        };
        this.unitLibrary = new UnitLibrary(this);
    }

    setState(state) {
        this.state = Object.assign(this.state, state);
    }

    getUnits(){
        return this.state.units;
    }

    findUnit(q) {
        return find(this.state.units, q);
    }

    getHitableUnits() {
        return filter(this.state.units, { canBeDamaged: true });
    }

    updUnitById(id, props) {
        const unit = this.findUnit({id});
        Object.assign(unit, props);
        return unit;
    }

    getUnitLibrary() {
        return this.unitLibrary;
    }

    loadSave() {
        const points = [
            {position: {x: 0, y: -50}},
            {position: {x: 50, y: -100}},
            {position: {x: 100, y: -100}},
            {position: {x: 150, y: -50}},
            {position: {x: 150, y: 0}},
            {position: {x: 100, y: 50}},
            {position: {x: 50, y: 50}},
            {position: {x: 0, y: 0}},
            {position: {x: 0, y: 300}, rotation: 0},
        ];
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
            { id: 17, viewSkin: "lake", name: "Lake", position: {x: -120, y: 210}, isInteractive: true },
            { id: 18, viewSkin: "tree3items", position: {x: 80, y: 150} },
            { id: 19, viewSkin: "grass4items", position: {x: -80, y: 220} },
            { id: 20, viewSkin: "grass4items", position: {x: -150, y: 270} },
            { id: 21, viewSkin: "road", position: {x: 0, y: 0} },

            {
                id: 1, viewSkin: "char", name: "", accountId: 1, position: { x: 0, y: 0 }, rotation: 1.57, isInteractive: true,
                canBeDamaged: true,
                state: { hp: 100, isDead: false },
                stats: { maxHp: 100 },
            },
            {
                id: 2, viewSkin: "char", name: "Dvadi", position: { x: 0, y: 0 }, rotation: 3.5, isInteractive: true,
                canBeDamaged: true,
                state: { hp: 100, isDead: false },
                stats: { maxHp: 100 },
                wishes: [ { name: "DemoWish", points } ],

            },
            { id: 0, viewSkin: "debugPoint", position: { x: 0, y: 0 }, rotation: 0 },
            // { id: 0, viewSkin: "debugArea", position: { x: 0, y: 0 }, rotation: 0, radius: 20 },
        ];
        this.state.units = units;

        return Promise.resolve(units);
    }
}

export default WorldState;
