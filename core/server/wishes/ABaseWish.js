class ABaseWish{
    constructor(unit, wishDescription, unitLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitLibrary = unitLibrary;
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

