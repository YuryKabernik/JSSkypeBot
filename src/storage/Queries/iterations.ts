/**
 * @file Iterations - contains stored procedure requests to 'iterations' table.
 */

import { ConnectionPool, NVarChar, Bit } from "mssql";
import { IIteration } from "../interfaces/IIteration";

export function GetIterationById(connection: ConnectionPool, id: string) {
    return {
        execute: async () => await connection
            .request()
            .input('iterationId', id)
            .execute('GetIterationById')
    };
};

export function GetAllIterations(connection: ConnectionPool, amount: number = 100) {
    return {
        execute: async () => await connection
            .request()
            .input('amount', amount)
            .execute('GetAllIterations')
    };
};
export function SaveIteration(connection: ConnectionPool, iteration: IIteration) {
    return {
        execute: async () => await connection
            .request()
            .input('id', NVarChar, iteration.id)
            .input('path', NVarChar, iteration.data.path)
            .input('date', iteration.data.date)
            .execute('SaveIteration')
    };
};
export function RemoveIteration(connection: ConnectionPool, id: string) {
    return {
        execute: async () => await connection
            .request()
            .input('id', id)
            .execute('RemoveIteration')
    };
};
export function IsIterationIncluded(connection: ConnectionPool, id: string) {
    return {
        execute: async () => await connection
            .request()
            .input('id', id)
            .output('isIncluded', Bit, 'isIncluded')
            .execute('IsIterationIncluded')
    };
};
