class Container {
    constructor() {
        this._registrations = {};
    }

    getInstance(type) {
        const registrationExists = this._registrations[type];
        if (registrationExists) {
            return this._registrations[type];
        }
    }

    register(type, instance, override = false) {
        const registrationNotExists = !this._registrations[type];
        if (registrationNotExists) {
            this._registrations[type] = instance;
        } else if (override) {
            this._registrations[type] = instance;
        }
        return this;
    }

    unregister(type) {
        const typeCanBeRemoved = Object.keys(this._registrations).length && this._registrations[type];
        if (typeCanBeRemoved) {
            delete this._registrations[type];
        }
        return this;
    }
}

module.exports.Container = Container;
