const ServerCore = require("./ServerCore");
const WorldState = require("../state/WorldState");
const CharFactory = require("../state/CharFactory");
const expect = require("expect");

class WorldStateMock extends WorldState {
    loadSave() {
        const realmUnits = [
            CharFactory.initEmptyCharacter({
                wishes: [
                    { name: "FollowWish", targetUnitId: this.uniqueId() },
                ],
            }),
        ];
        this.state.units = realmUnits;

        return Promise.resolve();
    }
}

describe("ServerCore", () => {
    describe("with wishManager", () => {
        it("should init", () => {
            new ServerCore();
        });
        it("should not init wishes before load", () => {
            const core = new ServerCore();
            const count = core.wishManager.wishesCount();
            expect(count === 0).toBeTruthy();
        });
        it("should init wishes after load", async () => {
            const core = new ServerCore({ WorldState: WorldStateMock });
            await core.load();
            const count = core.wishManager.wishesCount();
            expect(count > 0).toBeTruthy();
        });
    });
});