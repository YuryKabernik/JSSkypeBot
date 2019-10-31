/**
 * @file Middlware array initialization.
 */
const ProactiveMiddleware = require('../middleware/proactive.js');

/**
 * Register proactive middlewares.
 */
module.exports.Register = (adapter) => {
    const middlewares = [
        ProactiveMiddleware.trustServiceUrl
    ];

    if (middlewares && middlewares.every(middleware => typeof (middleware) === 'function')) {
        middlewares.forEach(middleware => adapter.use(middleware));
    }
};
