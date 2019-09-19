const collisions = require("../utils/collisions");
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

    /**
     * Example:
     * getUnitsInArea({position: {x ,y}, radius})
     */
    getUnitsInArea(area) {
        const units = this.worldState.getHitableUnits();
        return collisions.findUnitsInArea(units, area);
    }

    getTime() {
        return this.worldState.getTime();
    }
}

module.exports = UnitLibrary;
