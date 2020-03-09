const ABaseWish = require("./ABaseWish");
const collisions = require("../../utils/collisions");
const CombatBehaviour = require("./CombatBehaviour");

class DefendBehaviour extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
        this.enemies = [];
        this.combatBehaviour = null;
    }

    getActions(delta){
        return [
            ...(this.combatBehaviour ? this.combatBehaviour.getActions(delta) : []),
        ];
    }

    isActive() {
        return !this.unit.state.isDead;
    }

    getPriority() {
        if (this.combatBehaviour){
            return 10;
        }
        this.enemies = this.unitLibrary.getUnitsInArea({ position: this.unit.position, radius: 200 })
            .filter((unit) => unit.id !== this.unit.id)
            .filter((unit) => this.wishDescription.enemyFactions.includes(unit.state.faction));
        if (this.enemies.length > 0) {
            this.startCombat(this.enemies[0]);
        }
        return super.getPriority();
    }

    /** @private */

    startCombat(targetUnit) {
        this.combatBehaviour = new CombatBehaviour(this.unit, { targetUnitId: targetUnit.id }, this.unitLibrary);
    }
    stopCombat(){
        this.combatBehaviour = null;
    }

}

module.exports = DefendBehaviour;
