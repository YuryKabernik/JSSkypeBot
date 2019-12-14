export class Container {
    _registrations: { [x: string]: Object | Function };

    constructor() {
        this._registrations = {};
    }

    getInstance(type: string) {
        const registrationExists = this._registrations[type];
        if (registrationExists) {
            return this._registrations[type];
        }
    }

    register(type: string, instance: Object | Function, override = false) {
        const registrationNotExists = !this._registrations[type];
        if (registrationNotExists) {
            this._registrations[type] = instance;
        } else if (override) {
            this._registrations[type] = instance;
        }
        return this;
    }

    unregister(type: string) {
        const typeCanBeRemoved = Object.keys(this._registrations).length && this._registrations[type];
        if (typeCanBeRemoved) {
            delete this._registrations[type];
        }
        return this;
    }
}
