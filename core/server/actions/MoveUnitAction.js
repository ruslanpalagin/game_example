const BaseAction = require("./BaseAction");
const WS_ACTIONS = require("../../WS_ACTIONS");

class MoveUnitAction extends BaseAction{
    static changeTheWorld({ unitId, uPoint }, worldState) {
        if (uPoint.position && (isNaN(uPoint.position.x) || isNaN(uPoint.position.y))) {
            throw new Error("invalid position " + JSON.stringify(uPoint.position));
        }
        worldState.updateUnitById(unitId, uPoint);
        return {
            wsActions: [
                { name: WS_ACTIONS.MOVE_UNIT, unitId, uPoint }
            ]
        }
    }
}

module.exports = MoveUnitAction;
