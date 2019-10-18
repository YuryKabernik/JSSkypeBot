const sql = require('mssql');
const Injection = require('../configuration/registerTypes.js');

module.exports.dbConnection = function dbConnection() {
    const logger = Injection.getInstance('Common.Logger', __filename);
    const errorHandler = error => error && logger.logError(error);
    const connectionString = process.env.ConnectionString;

    const connection = new sql.ConnectionPool(connectionString, errorHandler);

    if (!connection.config.options.useUTC) {
        connection.config.options.useUTC = false;
    }
    return connection;
};
