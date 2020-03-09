const collisions = require("../../utils/collisions");
const ABaseWish = require("./ABaseWish");
const FollowWish = require("./FollowWish");

class CombatBehaviour extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
        this.targetUnit = unitLibrary.findUnit({id: wishDescription.targetUnitId });
        this.followWish = new FollowWish(
            this.unit,
            { name: "FollowWish", unitId: this.unit.id, targetUnitId: this.targetUnit.id },
            this.unitLibrary,
        );
    }

    getActions(delta){
        let actions = [];

        const time = (new Date()).getTime();
        const distance = collisions.getDistance(this.unit, this.targetUnit);
        if (distance < 30 && (this.unit.state.coolDownsUntil.melee === null || time > this.unit.state.coolDownsUntil.melee)) {
            actions.push({ name: "MeleeAttackAction", unitId: this.unit.id, sourceUnit: this.unit });
        }

        actions = actions.concat(this.followWish.getActions(delta));

        return actions;
    }

    isActive(){
        return !this.unit.state.isDead && !this.targetUnit.state.isDead;
    }

    /** @private */

}

module.exports = CombatBehaviour;

