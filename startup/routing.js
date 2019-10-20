/**
 * @file Routing - executes routing to the specific server endpoint.
 */
const { botRoutes } = require('../presentation/bot/bot.js');
const { apiRoutes } = require('../presentation/api/api.js');

module.exports.Routing = {
    /**
     * Registers an array of routes on proviede server.
     * @param {Server} server Target server object.
     * @param {Function} routes Function that will register routes.
     */
    Register(server) {
        botRoutes(server.router);
        apiRoutes(server.router);
    }
};
