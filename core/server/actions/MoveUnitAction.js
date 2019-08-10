const BaseAction = require("./BaseAction");
const WS_ACTIONS = require("../../WS_ACTIONS");

class MoveUnitAction extends BaseAction{
    static changeTheWorld({ unitId, uPoint }, worldState) {
        worldState.updUnitById(unitId, uPoint);
        return {
            wsActions: [
                { name: WS_ACTIONS.MOVE_UNIT, unitId, uPoint }
            ]
        }
    }
}

module.exports = MoveUnitAction;
