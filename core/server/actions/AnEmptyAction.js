const BaseAction = require("./BaseAction");

class AnEmptyAction extends BaseAction{
    static changeTheWorld(action, worldState) {
        return {
            wsActions: [],
        };
    }
}

module.exports = AnEmptyAction;
