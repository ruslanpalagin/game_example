const BaseAction = require("./BaseAction");

class NewWishAction extends BaseAction{
    static changeTheWorld({unitId, wishDescription}, worldState) {
        return {
            wishes: [
                { ...wishDescription, unitId },
            ],
        };
    }
}

module.exports = NewWishAction;
