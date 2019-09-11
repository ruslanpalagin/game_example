const ABaseWish = require("./ABaseWish");

class AnEmptyWish extends ABaseWish {
    getActions(delta){
        return [
            { name: "AnEmptyAction", unitId: this.unit.id, meta: this.wishDescription.meta },
        ];
    }

    isActive() {
        return !this.wishDescription.isDisabled;
    }
}

module.exports = AnEmptyWish;

