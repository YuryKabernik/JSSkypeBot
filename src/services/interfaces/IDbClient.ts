import { IProcedureResult } from "mssql";

export interface IDbClient {
    request: (clientRequest: Function, ...args: any[]) => Promise<IProcedureResult<any>>
}