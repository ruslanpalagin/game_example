class BaseAction{
    static changeTheWorld(/*action, worldState*/) {
        throw new Error("changeTheWorld MUST be defined");
    }
}

module.exports = BaseAction;
