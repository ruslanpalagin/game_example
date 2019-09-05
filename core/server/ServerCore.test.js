const ServerCore = require("./ServerCore");
const WorldStateMock = require("../tests/WorldStateMock");
const expect = require("expect");

describe("ServerCore", () => {
    it("should init", () => {
        new ServerCore();
    });

    describe("with wishManager", () => {
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