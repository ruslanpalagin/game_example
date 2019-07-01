export default class LoopActionsQ{
    constructor() {
        this.q = {};
    }

    // names: move, hit, say
    setAction(action) {
        this.q[action.unit.id][action.name] = action;
    }

    mergeActions(actions) {
        actions.forEach((action) => {
            this.setAction(action)
        });
    }
}