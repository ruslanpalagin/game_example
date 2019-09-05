class AnEmptyWish {
    constructor(unit, wishDescription, unitsLibrary){
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.unitsLibrary = unitsLibrary;
    }

    getPriority(){
        return this.wishDescription && this.wishDescription.meta && this.wishDescription.meta.mockPriority;
    }

    getActions(delta){
        return [
            { name: "AnEmptyAction", unitId: this.unit.id, meta: this.wishDescription.meta },
        ];
    }
}

module.exports = AnEmptyWish;

