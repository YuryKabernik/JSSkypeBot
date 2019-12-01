/**
 * @file Routing - executes routing to the specific server endpoint.
 */
const { apiRoutes } = require('../presentation/api/api.js');

module.exports.Routing = {
    /**
     * Registers an array of routes on proviede server.
     * @param {Server} server Target server object.
     * @param {Function} routes Function that will register routes.
     */
    Register(server) {
        apiRoutes(server.router);
    }
};
