const PatrolWish = require("./wishes/PatrolWish");
const AggressiveWish = require("./wishes/AggressiveWish");
const FollowWish = require("./wishes/FollowWish");
const AnEmptyWish = require("./wishes/AnEmptyWish");
const BennetBehaviour = require("./wishes/BennetBehaviour");
const DefendBehaviour = require("./wishes/DefendBehaviour");

const mapping = {
    "PatrolWish": PatrolWish,
    "AggressiveWish": AggressiveWish,
    "FollowWish": FollowWish,
    "AnEmptyWish": AnEmptyWish,
    "BennetBehaviour": BennetBehaviour,
    "DefendBehaviour": DefendBehaviour,
};

class WishManager{
    constructor(unitLibrary) {
        this.unitLibrary = unitLibrary;
        this.whishesPerUnit = {};
    }

    initWishesFromUnits(units) {
        for (let i in units) {
            const unit = units[i];
            if (!unit.wishes || unit.wishes.length === 0) {
                continue;
            }
            this.whishesPerUnit[unit.id] = this._instantiateWishes(unit, unit.wishes, this.unitLibrary);
        }
    }

    getActions(delta) {
        let actions = [];
        Object.values(this.whishesPerUnit).forEach((unitWishes) => {
            const { wish } = this._findTopWish({ wishes: unitWishes, delta });
            if (wish) {
                actions = actions.concat(wish.getActions(delta));
            }
        });
        return { actions };
    }

    wishesCount() {
        return Object.values(this.whishesPerUnit).reduce((sum, wishes) => sum + wishes.length, 0);
    }

    _findTopWish({ wishes, delta }){
        let topPriority = -Infinity;
        let topWish = null;
        if (wishes.length === 0) {
            return { topPriority, topWish };
        }
        for (let i in wishes) {
            const iWish = wishes[i];
            if (!iWish.isActive()) {
                continue;
            }
            iWish.beforeGetPriority(delta);
            const currentPriority = iWish.getPriority(delta);
            if (currentPriority > topPriority) {
                topPriority = currentPriority;
                topWish = iWish;
            }
        }
        return { topPriority, wish: topWish };
    }

    _instantiateWish(unit, wishDescription, unitLibrary){
        const Wish = mapping[wishDescription.name];
        if (!Wish) {
            console.log("Wish not found: " + wishDescription.name);
            return;
        }
        return new Wish(unit, wishDescription, unitLibrary);
    }

    _instantiateWishes(unit, wishDescriptions, unitLibrary){
        return wishDescriptions.map((wishDescription) => {
            return this._instantiateWish(unit, wishDescription, unitLibrary);
        })
    }
}

module.exports = WishManager;
