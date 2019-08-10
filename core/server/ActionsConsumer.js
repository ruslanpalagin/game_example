const MoveUnitAction = require("./actions/MoveUnitAction");

const mapping = {
    "MoveUnitAction": MoveUnitAction,
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
