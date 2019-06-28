/**
 * WorldStage but read-only
 */
export default class UnitLibrary {
    constructor(worldState) {
        this.worldState = worldState;
    }

    findUnit(q) {
        return this.worldState.findUnit(q);
    }
}