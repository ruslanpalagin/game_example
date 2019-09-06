const find = require("lodash/find");
const filter = require("lodash/filter");
const uniqueId = require("lodash/uniqueId");
const UnitLibrary = require("./UnitLibrary");

class WorldState {
    constructor() {
        this.state = {
            realmUnits: [],
            guestUnits: [],
            units: [],
        };
        this.unitLibrary = new UnitLibrary(this);
        this.uniqueId = uniqueId;
    }

    setState(state) {
        this.state = Object.assign(this.state, state);
        console.log("this.state", this.state);
    }

    getUnits(){
        // console.log("deprecated - use unitLibrary");
        return this.state.units;
    }

    findUnit(q) {
        // console.log("deprecated - use unitLibrary");
        return find(this.state.units, q);
    }

    getHitableUnits() {
        // console.log("deprecated - use unitLibrary");
        return filter(this.state.units, { canBeDamaged: true });
    }

    updateUnitById(id, props) {
        const unit = this.findUnit({id});
        Object.assign(unit, props);
        return unit;
    }

    updateUnitStateById(id, props) {
        const unit = this.findUnit({id});
        Object.assign(unit.state, props);
        return unit;
    }

    getUnitLibrary() {
        return this.unitLibrary;
    }

    addDynamicUnit(unit) {
        this.state.guestUnits.push(unit);
        this.state.units.push(unit);
    }

    loadSave() {
        const diegoId = uniqueId();

        const realmUnits = [
            { id: uniqueId(), viewSkin: "treesBurned", position: {x: -100, y: -650} },
            { id: uniqueId(), viewSkin: "treesBurned", position: {x: 20, y: -670} },
            { id: uniqueId(), viewSkin: "treesBurned", position: {x: -80, y: -730} },
            { id: uniqueId(), viewSkin: "treesBurned", position: {x: 30, y: -740} },
            { id: uniqueId(), viewSkin: "mountain", position: {x: -130, y: -900} },
            { id: uniqueId(), viewSkin: "hills", position: {x: 240, y: -1200} },
            { id: uniqueId(), viewSkin: "hills", position: {x: -340, y: -1000} },
            { id: uniqueId(), viewSkin: "road", position: {x: 0, y: - 370 * 2} },

            { id: uniqueId(), viewSkin: "tree3items", position: {x: -300, y: -450} },
            { id: uniqueId(), viewSkin: "tree3items", position: {x: 400, y: -250} },
            { id: uniqueId(), viewSkin: "tree3items", position: {x: 20, y: 0} },
            { id: uniqueId(), viewSkin: "grass4items", position: {x: -60, y: 20} },
            { id: uniqueId(), viewSkin: "road", position: {x: 0, y: -370} },

            { id: uniqueId(), viewSkin: "hills", position: {x: -240, y: 150} },
            { id: uniqueId(), viewSkin: "lake", name: "Lake", position: {x: -120, y: 210}, isInteractive: true },
            { id: uniqueId(), viewSkin: "tree3items", position: {x: 80, y: 150} },
            { id: uniqueId(), viewSkin: "grass4items", position: {x: -80, y: 220} },
            { id: uniqueId(), viewSkin: "grass4items", position: {x: -150, y: 270} },
            { id: uniqueId(), viewSkin: "road", position: {x: 0, y: 0} },

            {
                id: diegoId,
                viewSkin: "char", name: "Diego", position: { x: 220, y: 330 }, rotation: 1.57, isInteractive: true,
                canBeTarget: true,
                canBeDamaged: true,
                state: { hp: 10000, isDead: false },
                stats: { maxHp: 10000, lvl: 1 },
                wishes: [
                    { name: "PatrolWish", points: [
                        {position: {x: 0, y: -50}},
                        {position: {x: 50, y: -100}},
                        {position: {x: 100, y: -100}},
                        {position: {x: 150, y: -50}},
                        {position: {x: 150, y: 0}},
                        {position: {x: 100, y: 50}},
                        {position: {x: 50, y: 50}},
                        {position: {x: 0, y: 0}},
                        {position: {x: -30, y: 300}, rotation: 0},
                    ] }
                ],
            },
            {
                id: uniqueId(),
                viewSkin: "char", name: "Jack", position: { x: 0, y: 0 }, rotation: 3.5, isInteractive: true,
                canBeTarget: true,
                canBeDamaged: true,
                state: { hp: 100, isDead: false },
                stats: { maxHp: 100, lvl: 1 },
                wishes: [
                    // { name: "PatrolWish", points: [
                    //     {position: {x: 0, y: -50}},
                    //     {position: {x: 50, y: -100}},
                    //     {position: {x: 100, y: -100}},
                    //     {position: {x: 150, y: -50}},
                    //     {position: {x: 150, y: 0}},
                    //     {position: {x: 100, y: 50}},
                    //     {position: {x: 50, y: 50}},
                    //     {position: {x: 0, y: 0}},
                    //     {position: {x: 0, y: 300}, rotation: 0},
                    // ] }
                ],
            },
            {
                id: uniqueId(),
                viewSkin: "charBandit", name: "Bandit", position: { x: -25, y: -670 }, rotation: 0, isInteractive: true,
                canBeTarget: true,
                canBeDamaged: true,
                state: { hp: 7800, isDead: false },
                stats: { maxHp: 8000, lvl: 2 },
                wishes: [
                    // { name: "AggressiveWish", agroRadius: 200, followRadius: 200 }
                ],
            },
            {
                id: uniqueId(),
                viewSkin: "charMad", name: "Mad", position: { x: -50, y: 50 }, rotation: 0, isInteractive: true,
                canBeTarget: true,
                canBeDamaged: true,
                state: { hp: 100, isDead: false },
                stats: { maxHp: 100, lvl: 1 },
                wishes: [
                    { name: "FollowWish", targetUnitId: diegoId },
                ],
            },
            { id: uniqueId(), viewSkin: "debugPoint", position: { x: 0, y: 0 }, rotation: 0 },
            { id: uniqueId(), viewSkin: "debugArea", position: { x: 0, y: 0 }, rotation: 0, radius: 20 },
        ];
        const guestUnits = [];

        this.state.realmUnits = realmUnits;
        this.state.guestUnits = guestUnits;
        this.state.units = [...realmUnits, ...guestUnits];

        return Promise.resolve();
    }
}

module.exports = WorldState;
