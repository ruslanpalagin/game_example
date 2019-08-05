function decorateWithEvents(classs) {
    const decoratedObject = classs.prototype || classs;

    decoratedObject.on = function (name, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[name] = this.callbacks[name] || [];
        this.callbacks[name].push(callback);
    };

    decoratedObject.emit = function (name, data) {
        this.callbacks = this.callbacks || {};
        if (!this.callbacks[name]) {
            return;
        }

        for (const i in this.callbacks[name]) {
            this.callbacks[name][i](data);
        }
    };

    /**
     * Example:
     *   obj.offAllByName("click", this.handleResize)
     */
    decoratedObject.off = function (name, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[name] = this.callbacks[name] || [];
        const index = this.callbacks[name].indexOf(callback);
        this.callbacks[name].splice(index, 1);
    };

    /**
     * Example:
     *   obj.offAllByName("click")
     */
    decoratedObject.offAllByName = function (name) {
        this.callbacks = this.callbacks || {};
        if (this.callbacks[name]) {
            delete this.callbacks[name];
        }
    };

    /**
     * Example:
     *   obj.offAll()
     */
    decoratedObject.offAll = function () {
        this.callbacks = {};
    };

    return classs;
}

export default decorateWithEvents;
