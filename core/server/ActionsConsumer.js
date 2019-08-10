const MoveUnitAction = require("./actions/MoveUnitAction");
const MeleeAttackAction = require("./actions/MeleeAttackAction");
const RangeAttackAction = require("./actions/RangeAttackAction");
const InteractWithAction = require("./actions/InteractWithAction");
const SayAreaAction = require("./actions/SayAreaAction");
const NewWishAction = require("./actions/NewWishAction");

const mapping = {
    "MoveUnitAction": MoveUnitAction,
    "MeleeAttackAction": MeleeAttackAction,
    "RangeAttackAction": RangeAttackAction,
    "InteractWithAction": InteractWithAction,
    "SayAreaAction": SayAreaAction,
    "NewWishAction": NewWishAction,
};

class ActionsConsumer {
    static consume(action, worldState) {
        const Action = mapping[action.name];
        if (!Action){
            console.log("Action is not defined:" + action.name);
        }
        return Action ? Action.changeTheWorld(action, worldState) : {};
    }
}

module.exports = ActionsConsumer;
