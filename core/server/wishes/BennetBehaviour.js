const ABaseWish = require("./ABaseWish");
const collisions = require("../../utils/collisions");

class BennetBehaviour extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
    }

    getActions(delta){
        const actions = [];

        const { h } = this.unitLibrary.getTime();
        if (
            (h >= 8 && h < 13) ||
            (h >= 14 && h < 18)
        ) {
            const moveAction = {
                name: "MoveUnitAction",
                unitId: this.unit.id,
                uPoint: collisions.movementPointBetween(this.unit, this.wishDescription.work, { speed: this.unit.state.speed, delta }),
            };

            actions.push(moveAction);
        } else {
            const moveAction = {
                name: "MoveUnitAction",
                unitId: this.unit.id,
                uPoint: collisions.movementPointBetween(this.unit, this.wishDescription.home, { speed: this.unit.state.speed, delta }),
            };

            actions.push(moveAction);
        }

        return actions;
    }

    isActive() {
        return !this.unit.state.isDead;
    }
}

module.exports = BennetBehaviour;
