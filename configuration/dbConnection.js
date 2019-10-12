const sql = require('mssql');
const Injection = require('../configuration/registerTypes.js');

module.exports.dbConnection = function dbConnection() {
    this.logger = Injection.getInstance('Common.Logger', __filename);
    return new sql.ConnectionPool(process.env.ConnectionString, error => this.logger.logError(error));
};
