const Injection = require('../configuration/registerTypes.js');

class DbClient {
    constructor(dbConnection) {
        this.connectionPool = dbConnection;
        this._logger = Injection.getInstance('Common.Logger', 'DbClient');
    }

    async request(clientRequest, ...args) {
        let result = null;
        try {
            result = await clientRequest(this.connectionPool, ...args).execute();
        } catch (error) {
            this._logger.logError(error);
        }
        return result;
    }
}

module.exports.DbClient = DbClient;
