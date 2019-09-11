const WorldState = require("../state/WorldState");
const CharFactory = require("../state/CharFactory");

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

module.exports = WorldStateMock;
