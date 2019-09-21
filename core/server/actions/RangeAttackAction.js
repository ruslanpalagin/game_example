const BaseAction = require("./BaseAction");
const WS_ACTIONS = require("../../WS_ACTIONS");
const PROJECTILES = require("../../PROJECTILES.js");
const Projectile = require('../projectiles/Projectile');

class RangeAttackAction extends BaseAction {
    static changeTheWorld(action, worldState) {
        // props for projectile
        const { distance, speed, bounds } = PROJECTILES[action.projectileId];
        const sourceUnit = worldState.findUnit({ id: action.sourceUnit.id });

        const newProjectile = new Projectile(sourceUnit, speed, distance, bounds);
        newProjectile.startTime = new Date().getTime(); // for tests
        // TODO -v do not affect vars. be functional
        // action.distance = distance;
        // action.flightDuration = newProjectile.flightDuration;
        worldState.state.projectiles.push(newProjectile);

        return {
            wsActions: {
                name: WS_ACTIONS.RANGE_ATTACK,
                sourceUnit: { id: action.sourceUnit.id },
                projectileId: action.projectileId,
                flightDuration: newProjectile.flightDuration
            }
        };
    }
}

module.exports = RangeAttackAction;
