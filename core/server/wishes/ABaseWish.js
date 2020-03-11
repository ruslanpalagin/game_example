class ABaseWish{
    constructor(unit, wishDescription, unitLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitLibrary = unitLibrary;
    }

    isActive() {
        return true;
    }

    beforeGetPriority(delta){}

    getPriority(){
        return this.wishDescription.priority || 0;
    }

    getActions(delta){
        return [];
    }
}

module.exports = ABaseWish;

