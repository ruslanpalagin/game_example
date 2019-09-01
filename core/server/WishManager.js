const PatrolWish = require("./wishes/PatrolWish");
const SayLaterWish = require("./wishes/SayLaterWish");
const AggressiveWish = require("./wishes/AggressiveWish");
const FollowWish = require("./wishes/FollowWish");

class WishManager{
    constructor(unitLibrary) {
        this.unitLibrary = unitLibrary;
        this.whishesPerUnit = {};
    }

    initWishesFromUnits(units) {
            for (let i in units) {
                const unit = units[i];
                if (!unit.wishes) {
                    continue;
                }
                unit.wishes.forEach((wishDescription) => {
                    const wish = this._instantiateWish(unit, wishDescription);
                    if (wish) {
                        this.whishesPerUnit[unit.id] = this.whishesPerUnit[unit.id] || [];
                        this.whishesPerUnit[unit.id].push(wish);
                    }
                });
            }
    }

    getActions(delta) {

    }

    wishesCount() {
        return Object.values(this.whishesPerUnit).reduce((sum, wishes) => sum + wishes.length, 0);
    }

    _instantiateWish(unit, wishDescription){
        const mapping = {
            "PatrolWish": PatrolWish,
            "SayLaterWish": SayLaterWish,
            "AggressiveWish": AggressiveWish,
            "FollowWish": FollowWish,
        };
        const Wish = mapping[wishDescription.name];
        if (!Wish) {
            console.log("Wish not found: " + wishDescription.name);
            return;
        }
        return new Wish(unit, wishDescription, this.unitLibrary);
    }
}

module.exports = WishManager;
