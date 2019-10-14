const sql = require('mssql');
const Injection = require('../configuration/registerTypes.js');

module.exports.dbConnection = function dbConnection() {
    this.logger = Injection.getInstance('Common.Logger', __filename);
    const connection = new sql.ConnectionPool(process.env.ConnectionString, error => error && this.logger.logError(error));
    if (!connection.config.options.useUTC) {
        connection.config.options.useUTC = false;
    }
    return connection;
};
