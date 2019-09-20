const { Injector } = require('../common/injector.js');
const { Logger } = require('../common/logger.js');

module.exports.registerTypes = function registerTypes() {
    const injector = new Injector();

    injector.register('Common.Logger', (...args) => new Logger(...args));

    return function getInstanceCallback(typeName, ...args) {
        const instance = injector.getInstance(typeName);
        return typeof instance === 'function' ?
            instance(...args) :
            instance;
    };
};
