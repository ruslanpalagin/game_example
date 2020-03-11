const ABaseWish = require("./ABaseWish");
const CombatBehaviour = require("./CombatBehaviour");

const AGRO_RADIUS = 200;

class DefendBehaviour extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
        this.enemies = [];
        this.combatBehaviour = null;
    }

    getActions(delta){
        return this.combatBehaviour && this.combatBehaviour.isActive()
            ? this.combatBehaviour.getActions(delta)
            : [];
    }

    isActive() {
        return !this.unit.state.isDead;
    }

    beforeGetPriority(){
        // TODO debounce by 1s
        if (this.combatBehaviour && !this.combatBehaviour.isActive()) {
            this.stopCombat();
        }
        if (!this.combatBehaviour){
            const enemy = this.findEnemy();
            enemy && this.startCombat(enemy);
        }
    }

    getPriority() {
        return this.combatBehaviour ? 10 : super.getPriority();
    }

    /** @private */

    startCombat(targetUnit) {
        this.combatBehaviour = new CombatBehaviour(this.unit, { targetUnitId: targetUnit.id }, this.unitLibrary);
    }

    stopCombat(){
        this.combatBehaviour = null;
    }

    findEnemy() {
        this.enemies = this.unitLibrary.getUnitsInArea({ position: this.unit.position, radius: AGRO_RADIUS })
            .filter((unit) => unit.id !== this.unit.id)
            .filter((unit) => !unit.state.isDead)
            .filter((unit) => this.wishDescription.enemyFactions.includes(unit.state.faction));
        if (this.enemies.length > 0) {
            return this.enemies[0];
        }
    }
}

module.exports = DefendBehaviour;
