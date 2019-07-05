export default class LoopActionsQ{
    constructor() {
        this.q = {};
    }

    // names: move, hit, say
    setAction(action) {
        if (!action.unitId) {
            throw new Error("action.unitId is required");
        }
        if (!action.name) {
            throw new Error("action.name is required");
        }
        this.q[action.unitId] = this.q[action.unitId] || {};
        this.q[action.unitId][action.name] = action;
    }

    mergeActions(actions) {
        actions.forEach((action) => {
            this.setAction(action)
        });
    }

    flush() {
        this.q = {};
    }
}