const sql = require('mssql');
const Injection = require('./registerTypes.js');

module.exports.dbConnection = function dbConnection() {
    const logger = Injection.getInstance('Common.Logger', __filename);
    const errorHandler = error => error && logger.logError(error);
    const connectionString = process.env.ConnectionString;

    if (!connectionString) {
        logger.logInfo('No ConnectionString provided, skipping database connection');
        return null;
    }

    const connection = new sql.ConnectionPool(connectionString);
    connection.on('error', errorHandler);

    if (connection.config && connection.config.options && !connection.config.options.useUTC) {
        connection.config.options.useUTC = false;
    }
    return connection;
};
