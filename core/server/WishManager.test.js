const WishManager = require("./WishManager");
const expect = require("expect");

const emptySet = [
    { name: "AnEmptyWish", meta: { name: "low", mockPriority: -1 } },
    { name: "AnEmptyWish", meta: { name: "normal", mockPriority: 0 } },
    { name: "AnEmptyWish", meta: { name: "high", mockPriority: 1 } },
];

const unit = { id: 1 };
const TICK_DELTA = 16;

describe("WishManager", () => {
    it("should init", () => {
        new WishManager();
    });
    it("should init wishes", () => {
        const wishManager = new WishManager();
        wishManager.initWishesFromUnits([
            { id: 1, wishes: emptySet }
        ]);
        expect(wishManager.wishesCount()).toBe(3);
    });
    it("should find wish with highest priority", () => {
        const wishManager = new WishManager();
        const wishes = wishManager._instantiateWishes(unit, emptySet);
        const { wish } = wishManager._findTopWish({ wishes });
        expect(wish.wishDescription.meta.name).toBe("high");
    });
    it("should return actions", () => {
        const wishManager = new WishManager();
        wishManager.initWishesFromUnits([
            { id: 1, wishes: emptySet }
        ]);
        const { actions } = wishManager.getActions(TICK_DELTA);
        expect(actions.length).toBe(1);
    });
});