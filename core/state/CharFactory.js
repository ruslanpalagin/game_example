const uniqueId = require("lodash/uniqueId");

class CharFactory {
    constructor() {}

    // static findOrCreateCharacter(unitLibrary, session) {
    //     const unit = unitLibrary.findUnit({ accountId: session.accountId });
    //     return unit || this.initEmptyCharacter({ accountId: session.accountId });
    // }

    static initEmptyCharacter(data) {
        return Object.assign({
            id: uniqueId(),
            viewSkin: "char", name: `r#${Math.random()}`, position: { x: 0, y: 0 }, rotation: 1.57, isInteractive: true,
            canBeTarget: true,
            canBeDamaged: true,
            state: { hp: 100, isDead: false },
            stats: { maxHp: 100, lvl: 1 },
            targetUnitId: null,
        }, data);
    }

    static initTiamat() {
        return Object.assign({
            id: uniqueId(),
            viewSkin: "tiamat",
            name: "Tiamat",
            position: { x: 0, y: -1600 }, rotation: Math.PI,
            isInteractive: true,
            canBeTarget: true,
            canBeDamaged: true,
            state: { hp: 10000, isDead: false },
            stats: { maxHp: 10000, lvl: 10 },
            targetUnitId: null,
            metadata: { crawlColor: "9a0098" }
        }, data);
    }
}

module.exports = CharFactory;
