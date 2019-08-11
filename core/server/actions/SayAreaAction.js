const BaseAction = require("./BaseAction");
const WS_ACTIONS = require("../../WS_ACTIONS");

class SayAreaAction extends BaseAction{
    static changeTheWorld({unitId, message}, worldState) {
        return {
            wsActions: [
                { name: WS_ACTIONS.SAY_AREA, unitId, message },
            ],
        };
    }
}

module.exports = SayAreaAction;
