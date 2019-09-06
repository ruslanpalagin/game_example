const WishManager = require("./WishManager");
const expect = require("expect");

const emptySet = [
    { name: "AnEmptyWish", priority: -1, meta: { name: "low" } },
    { name: "AnEmptyWish", priority: 0, meta: { name: "normal" } },
    { name: "AnEmptyWish", priority: 1, meta: { name: "high" } },
];
const disabledSet = [
    { name: "AnEmptyWish", priority: 1, isDisabled: true },
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
    describe("_findTopWish", () => {
        it("should find wish with highest priority", () => {
            const wishManager = new WishManager();
            const wishes = wishManager._instantiateWishes(unit, emptySet);
            const { wish } = wishManager._findTopWish({ wishes });
            expect(wish.wishDescription.meta.name).toBe("high");
        });
        it("should return null for disabled wishes", () => {
            const wishManager = new WishManager();
            const wishes = wishManager._instantiateWishes(unit, disabledSet);
            const { wish } = wishManager._findTopWish({ wishes });
            expect(wish).toBe(null);
        });
    });
    describe("getActions", () => {
        it("should return array", () => {
            const wishManager = new WishManager();
            wishManager.initWishesFromUnits([
                { id: 1, wishes: emptySet }
            ]);
            const { actions } = wishManager.getActions(TICK_DELTA);
            expect(actions.length).toBe(1);
        });
        it("should return nothing for an empty wish set", () => {
            const wishManager = new WishManager();
            wishManager.initWishesFromUnits([
                { id: 1, wishes: [] },
                { id: 2 }
            ]);
            const { actions } = wishManager.getActions(TICK_DELTA);
            expect(actions.length).toBe(0);
        });
        it("should return nothing for disabled wishes", () => {
            const wishManager = new WishManager();
            wishManager.initWishesFromUnits([
                { id: 1, wishes: disabledSet },
            ]);
            const { actions } = wishManager.getActions(TICK_DELTA);
            expect(actions.length).toBe(0);
        });
    });
});