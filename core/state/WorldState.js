const find = require("lodash/find");
const filter = require("lodash/filter");
const uniqueId = require("lodash/uniqueId");
const UnitLibrary = require("./UnitLibrary");
const CharFactory = require("./CharFactory");

class WorldState {
    constructor() {
        this.state = {
            units: [],
            projectiles: [],
            time: (new Date()).getTime(),
        };
        this.unitLibrary = new UnitLibrary(this);
        this.uniqueId = uniqueId;
    }

    isLoaded() {
        return this.state.units.length > 0;
    }

    setState(state) {
        this.state = Object.assign(this.state, state);
        // console.log("this.state", this.state);
    }

    getUnits(){
        // console.log("deprecated - use unitLibrary");
        return this.state.units;
    }

    getTime(){
        const date = new Date(this.state.time);
        return {
            h: date.getUTCHours(),
            m: date.getUTCMinutes(),
        };
    }

    incTime(ms) {
        this.setState({ time: this.state.time + ms });
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
        if (!unit) {
            console.log("Unit not found: " + id);
            return null;
        }
        Object.assign(unit, props);
        return unit;
    }

    writeUnitCoolDown(id, coolDownName) {
        const unit = this.findUnit({id});
        unit.state.coolDownsUntil[coolDownName] = unit.stats.coolDowns[coolDownName] + (new Date()).getTime();
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
        // this.state.guestUnits.push(unit);
        this.state.units.push(unit);
    }

    loadSave() {
        const diegoId = uniqueId();

        const mapUnits = [
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

            { id: uniqueId(), viewSkin: "debugPoint", position: { x: 0, y: 0 }, rotation: 0 },
            { id: uniqueId(), viewSkin: "debugArea", position: { x: 0, y: 0 }, rotation: 0, radius: 20 },

            { id: uniqueId(), viewSkin: "house1", position: { x: -100, y: 0 } },
            { id: uniqueId(), viewSkin: "house1", position: { x: -120, y: 40 } },
            { id: uniqueId(), viewSkin: "house1", position: { x: 120, y: 20 } },
            { id: uniqueId(), viewSkin: "house1", position: { x: -100, y: 110 } },
            { id: uniqueId(), viewSkin: "house1", position: { x: 120, y: 100 } },

            { id: uniqueId(), viewSkin: "house1", position: { x: -100, y: 350 } },
            { id: uniqueId(), viewSkin: "house1", position: { x: 120, y: 340 } },
            { id: uniqueId(), viewSkin: "house1", position: { x: 100, y: 380 } },
            { id: uniqueId(), viewSkin: "grass4items", position: {x: -20, y: 420} },
        ];

        const diego = CharFactory.initEmptyCharacter({
            id: diegoId,
            viewSkin: "char",
            name: "Diego",
            position: { x: 150, y: -400 },
            wishes: [
                {
                    name: "DefendBehaviour",
                    enemyFactions: ["bandit"],
                },
            ],
        });
        diego.state.hp = 100;
        diego.state.speed = 30;
        diego.state.faction = "villager";
        diego.stats.maxHp = 100;
        diego.stats.coolDowns.melee = 1000;

        const bandit = CharFactory.initEmptyCharacter({
            viewSkin: "charBandit",
            name: "Bandit",
            position: { x: 50, y: -700 },
            wishes: [
                {
                    name: "DefendBehaviour",
                    enemyFactions: ["villager", "newPlayer"],
                },
            ],
        });
        bandit.state.hp = 80;
        bandit.state.speed = 30;
        bandit.state.faction = "bandit";
        bandit.stats.maxHp = 100;

        const npcs = [
            diego,
            bandit,
            // {
            //     id: uniqueId(),
            //     viewSkin: "char", name: "Jack", position: { x: 0, y: 0 }, rotation: 3.5, isInteractive: true,
            //     canBeTarget: true,
            //     canBeDamaged: true,
            //     state: {
            //         hp: 100,
            //         isDead: false,
            //         speed: 30
            //     },
            //     stats: { maxHp: 100, lvl: 1 },
            //     wishes: [
            //         { name: "PatrolWish", points: [
            //             {position: {x: 0, y: -50}},
            //             {position: {x: 50, y: -100}},
            //             {position: {x: 100, y: -100}},
            //             {position: {x: 150, y: -50}},
            //             {position: {x: 150, y: 0}},
            //             {position: {x: 100, y: 50}},
            //             {position: {x: 50, y: 50}},
            //             {position: {x: 0, y: 0}},
            //             {position: {x: 0, y: 300}, rotation: 0},
            //         ] }
            //     ],
            // },
            {
                id: uniqueId(),
                viewSkin: "char",
                name: "Bennet",
                position: { x: -50, y: 50 },
                rotation: 0,
                isInteractive: true,
                canBeTarget: true,
                canBeDamaged: true,
                state: { hp: 100, isDead: false, speed: 40 },
                stats: { maxHp: 100, lvl: 1 },
                wishes: [
                    {
                        name: "BennetBehaviour",
                        work: { position: { x: -300, y: 100} },
                        home: { position: { x: 100, y: 90} },
                    },
                ],
            },
            {
                id: uniqueId(),
                viewSkin: "charMad",
                name: "Mad",
                position: { x: -50, y: 50 },
                rotation: 0,
                isInteractive: true,
                canBeTarget: true,
                canBeDamaged: true,
                state: { hp: 100, isDead: false, speed: 40 },
                stats: { maxHp: 100, lvl: 1 },
                wishes: [
                    { name: "FollowWish", targetUnitId: diegoId },
                ],
            },
        ];
        this.state.units = [...mapUnits, ...npcs];

        return Promise.resolve();
    }
}

module.exports = WorldState;
