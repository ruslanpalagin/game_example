const BaseAction = require("./BaseAction");
const WS_ACTIONS = require("../../WS_ACTIONS");
const collisions = require("../../utils/collisions");

class MeleeAttackAction extends BaseAction{
    static changeTheWorld(action, worldState) {
        const wsActions = [];

        const sourceUnit = worldState.findUnit({id: action.sourceUnit.id});
        const hitArea = collisions.calcWeaponHitArea(sourceUnit);
        const hitUnits = collisions.findUnitsInArea(worldState.getHitableUnits(), hitArea);
        // wsActions.push({ name: WS_ACTIONS.DEBUG_AREA, ...hitArea });
        wsActions.push({ name: WS_ACTIONS.MELEE_ATTACK, sourceUnit: { id: sourceUnit.id } });
        worldState.writeUnitCoolDown(sourceUnit.id, "melee");

        hitUnits.forEach((hitUnit) => {
            if (hitUnit.id === sourceUnit.id) {
                return;
            }
            if (hitUnit.state.isDead) {
                return;
            }
            const newHp = hitUnit.state.hp - 40;
            const isDead = newHp <= 0;
            const newState = Object.assign(hitUnit.state, { hp: newHp, isDead });
            const updTargetUnit = worldState.updateUnitById(hitUnit.id, { state: newState });
            wsActions.push({ name: WS_ACTIONS.DAMAGE_UNIT, sourceUnit: {id: sourceUnit.id}, targetUnit: {id: updTargetUnit.id, state: updTargetUnit.state} });
            // TODO -v do not allow nested ternary
            const message = isDead ? "Oh, need to rest." : (newHp > 50 ? "Careful!" : "Stop It!");
            wsActions.push({ name: WS_ACTIONS.SAY_AREA, unitId: updTargetUnit.id, message });
        });

        return { wsActions };
    }
}

module.exports = MeleeAttackAction;
