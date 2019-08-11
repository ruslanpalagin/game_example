class SayLaterWish {
    constructor(unit, wishDescription){
        const { delay, message } = wishDescription;
        this.unit = unit;
        this.wishDescription = wishDescription;
        this.sayAfter = (new Date()).getTime() + delay;
        this.message = message;
    }

    getActions(){
        if (this.now() >= this.sayAfter) {
            return [
                { name: "SayAreaAction", unitId: this.unit.id, message: this.message },
            ]
        }
        return null;
    }

    isCompleted(){
        return this.unit.state.isDead || this.now() >= this.sayAfter;
    }

    now() {
        return (new Date()).getTime();
    }
}

module.exports = SayLaterWish;

