class AnEmptyWish {
    constructor(unit, wishDescription){
        this.unit = unit;
        this.wishDescription = wishDescription;
    }

    getActions(delta){
        return [];
    }

    isCompleted(){
        return true;
    }
}

module.exports = AnEmptyWish;

