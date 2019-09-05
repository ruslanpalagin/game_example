const PatrolWish = require("./wishes/PatrolWish");
const SayLaterWish = require("./wishes/SayLaterWish");
const AggressiveWish = require("./wishes/AggressiveWish");
const FollowWish = require("./wishes/FollowWish");
const AnEmptyWish = require("./wishes/AnEmptyWish");

const mapping = {
    "PatrolWish": PatrolWish,
    "SayLaterWish": SayLaterWish,
    "AggressiveWish": AggressiveWish,
    "FollowWish": FollowWish,
    "AnEmptyWish": AnEmptyWish,
};

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
            this.whishesPerUnit[unit.id] = this._instantiateWishes(unit, unit.wishes);
        }
    }

    getActions(delta) {
        let actions = [];
        Object.values(this.whishesPerUnit).forEach((unitWishes) => {
            const { wish } = this._findTopWish({ wishes: unitWishes, delta });
            actions = actions.concat(wish.getActions(delta));
        });
        return { actions };
    }

    wishesCount() {
        return Object.values(this.whishesPerUnit).reduce((sum, wishes) => sum + wishes.length, 0);
    }

    _findTopWish({ wishes, delta }){
        if (wishes.length === 0) {
            return null;
        }
        let priority = -Infinity;
        let wish = wishes[0];
        wishes.forEach((iWish) => {
            const currentPriority = iWish.getPriority(delta);
            if (currentPriority > priority) {
                priority = currentPriority;
                wish = iWish;
            }
        });
        return { priority, wish };
    }

    _instantiateWish(unit, wishDescription){
        const Wish = mapping[wishDescription.name];
        if (!Wish) {
            console.log("Wish not found: " + wishDescription.name);
            return;
        }
        return new Wish(unit, wishDescription, this.unitLibrary);
    }

    _instantiateWishes(unit, wishDescriptions){
        return wishDescriptions.map((wishDescription) => {
            return this._instantiateWish(unit, wishDescription);
        })
    }
}

module.exports = WishManager;
