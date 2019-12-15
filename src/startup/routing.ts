/**
 * @file Routing - executes routing to the specific server endpoint.
 */
import { apiRoutes } from '../presentation/api/api.js';
import { Server } from "restify";

export default {
    /**
     * Registers an array of routes on proviede server.
     * @param {Server} server Target server object.
     */
    Register(server: Server) {
        apiRoutes(server.router);
    }
};
