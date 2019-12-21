import { ConnectionPool } from 'mssql';
import { Injection } from '../configuration/registerTypes.js';

export function dbConnection(): ConnectionPool {
    const logger = Injection.getInstance('Common.Logger', __filename);
    const errorHandler = (error: any) => error && logger.logError(error);
    const connectionString = process.env.ConnectionString as string;
    const connection = new ConnectionPool(connectionString, errorHandler);
    // if (!connection.config.options.useUTC) {
    //     connection.config.options.useUTC = false;
    // }
    return connection;
};
