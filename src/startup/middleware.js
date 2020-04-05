/**
 * @file Middlware array initialization.
 */
const ProactiveMiddleware = require('../middleware/proactive.js');
const PromptMiddleware = require('../middleware/prompt.js');

/**
 * Register proactive middlewares.
 */
module.exports.Register = (adapter) => {
    const middlewares = [
        ProactiveMiddleware.trustServiceUrl,
        PromptMiddleware.promptParser
    ];

    if (middlewares && middlewares.every(middleware => typeof (middleware) === 'function')) {
        middlewares.forEach(middleware => adapter.use(middleware));
    }
};
