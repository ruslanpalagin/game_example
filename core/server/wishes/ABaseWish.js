class ABaseWish{
    constructor(unit, wishDescription, unitsLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitsLibrary = unitsLibrary;
    }

    getPriority(){
        return this.wishDescription.priority || 0;
    }

    isActive() {
        return true;
    }

    getActions(delta){
        return [];
    }
}

module.exports = ABaseWish;

