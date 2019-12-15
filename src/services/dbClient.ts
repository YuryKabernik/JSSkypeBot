import { IDbClient } from "./interfaces/IDbClient";
import { ConnectionPool } from "mssql";
import { ILogger } from "../common/interfaces/ILogger";
import { Injection } from "../configuration/registerTypes";

/**
 * Implementation of DB client request execution.
 */
export class DbClient implements IDbClient {
    readonly connectionPool: ConnectionPool;
    readonly _logger: ILogger;

    constructor(dbConnection: ConnectionPool) {
        this.connectionPool = dbConnection;
        this._logger = Injection.getInstance('Common.Logger', 'DbClient');
    }

    async request(clientRequest: Function, ...args: any[]): Promise<any> {
        let result = null;
        try {
            result = await clientRequest(this.connectionPool, ...args).execute();
        } catch (error) {
            this._logger.logError(error);
        }
        return result;
    }
}
