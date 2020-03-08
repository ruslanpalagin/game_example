const ABaseWish = require("./ABaseWish");
const collisions = require("../../utils/collisions");
// const FollowWish = require("./FollowWish");

class BennetBehaviour extends ABaseWish {
    constructor(unit, wishDescription, unitLibrary){
        super(unit, wishDescription, unitLibrary);
        this.workPlace = { x: 100, y: 100 };
        this.homePlace = { x: 1, y: 1 };
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
