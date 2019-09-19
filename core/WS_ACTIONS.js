module.exports = {
    /**
     * c -> s
     * empty payload
     */
    SYS_LOAD_USER: "SYS_LOAD_USER",
    /**
     * s -> c
     * worldState: { state: this.worldState.state } }
     */
    SYS_LOAD_WORLD: "SYS_LOAD_WORLD",
    /**
     * c -> s
     * empty payload
     */
    SEE_THE_WORLD: "SEE_THE_WORLD",
    /**
     * unitId
     */
    TAKE_CONTROL: "TAKE_CONTROL",
    /**
     * s -> c
     * empty payload
     */
    SYS_DISCONNECTED: "SYS_DISCONNECTED",
    /**
     * s -> c
     * unit - full unit data
     */
    SYS_ADD_DYNAMIC_UNIT: "SYS_ADD_DYNAMIC_UNIT",
    /**
     * sourceUnitId
     * targetUnitId
     */
    TARGET_UNIT: "TARGET_UNIT",
    /**
     * unitId
     * uPoint: { position, rotation }
     */
    MOVE_UNIT: "MOVE_UNIT",
    /**
     * sourceUnit: { id },
     targetUnit: { id },
     */
    INTERACT_WITH: "INTERACT_WITH",
    /**
     * slot: Number
     * sourceUnit: { id },
     */
    USE_ABILITY: "USE_ABILITY",
    /**
     * sourceUnit: { id },
     * projectileId
     * [s -> c] flightDuration - optional
     */
    RANGE_ATTACK: "RANGE_ATTACK",
    /**
     * userId
     * message
     */
    SAY_AREA: "SAY_AREA",
    /**
     * sourceUnit: { id }
     */
    MELEE_ATTACK: "MELEE_ATTACK",
    /**
     * targetUnit: { id, state }
     */
    DAMAGE_UNIT: "DAMAGE_UNIT",
    /**
     * positions: {x,y}
     * rotation
     * radius
     */
    DEBUG_AREA: "DEBUG_AREA",
};