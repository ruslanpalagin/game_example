/**
 * WorldStage read-only
 */
class UnitLibrary {
    constructor(worldState) {
        this.worldState = worldState;
    }

    findUnit(q) {
        return this.worldState.findUnit(q);
    }
}

module.exports = UnitLibrary;
