class AnEmptyWish {
    constructor(unit, wishDescription, unitsLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitsLibrary = unitsLibrary;
    }

    getPriority(){
        return 0;
    }

    getActions(delta){
        return [];
    }
}

module.exports = AnEmptyWish;

