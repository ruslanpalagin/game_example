const BaseAction = require("./BaseAction");
const WS_ACTIONS = require("../../WS_ACTIONS");

class InteractWithAction extends BaseAction{
    static changeTheWorld({ sourceUnit, targetUnit }, worldState) {
        const wsActions = [];
        const serverTargetUnit = worldState.findUnit({ id: targetUnit.id });
        wsActions.push({ name: WS_ACTIONS.SAY_AREA, unitId: sourceUnit.id, message: `Hello ${serverTargetUnit.name}` });

        let reply = "";

        if (Math.random() > 0.4) {
            reply = "Hi man";
        } else {
            reply = "What do you want?";
        }
        wsActions.push({ name: WS_ACTIONS.SAY_AREA, unitId: serverTargetUnit.id, message: reply });

        return {
            wsActions,
        };
    }
}

module.exports = InteractWithAction;
