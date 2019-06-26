function decorateWithEvents(classs) {
    classs = classs.prototype || classs;

    classs.on = function (name, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[name] = this.callbacks[name] || [];
        this.callbacks[name].push(callback);
    };

    classs.emit = function (name, data) {
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
    classs.off = function (name, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[name] = this.callbacks[name] || [];
        const index = this.callbacks[name].indexOf(callback);
        this.callbacks[name].splice(index, 1);
    };

    /**
     * Example:
     *   obj.offAllByName("click")
     */
    classs.offAllByName = function (name) {
        this.callbacks = this.callbacks || {};
        if (this.callbacks[name]) {
            delete this.callbacks[name];
        }
    };

    /**
     * Example:
     *   obj.offAll()
     */
    classs.offAll = function () {
        this.callbacks = {};
    };

    return classs;
}

export default decorateWithEvents;
