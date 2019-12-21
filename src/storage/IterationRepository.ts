import { Injection } from '../configuration/registerTypes';
import * as Iterations from './Queries/iterations';
import { ILogger } from "../common/interfaces/ILogger";
import { IDbClient } from '../services/interfaces/IDbClient';
import { IIteration } from './interfaces/IIteration';

export class IterationRepository {
    private _logger: ILogger;
    private _dbClient: IDbClient;

    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient', 'ReferenceRepository');
    }

    async all(): Promise<IIteration[] | null> {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.GetAllIterations);
        } catch (error) {
            this._logger.logError(error);
        }
        if (result && result.recordset) {
            return result.recordset.map(record => {
                const { ID, Date, Path } = record;
                return { id: ID, data: { date: Date, path: Path }};
            });
        }
        return null;
    }

    async getById(id: string): Promise<IIteration> {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.GetIterationById, id);
        } catch (error) {
            this._logger.logError(error);
        }
        return result && (result.recordset || [])[0];
    }

    async includes(id: string): Promise<Boolean> {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.IsIterationIncluded, id);
        } catch (error) {
            this._logger.logError(error);
            return false;
        }
        return result && result.output.isIncluded;
    }

    /**
     * Saves iteration by provided id.
     * @param {IIteration} iteration Iteration data that need to be stored.
     */
    async save(iteration: IIteration) {
        let result = null;
        try {
            result = await this._dbClient.request(
                Iterations.SaveIteration,
                {
                    id: iteration.id,
                    iteration: iteration.data
                }
            );
        } catch (error) {
            this._logger.logError(error);
        }
        if (result && result.returnValue) {
            return result.returnValue;
        }
        return result;
    }

    async remove(id: string) {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.RemoveIteration, id);
        } catch (error) {
            this._logger.logError(error);
        }
        if (result && result.returnValue) {
            return result.returnValue;
        }
        return result;
    }
}
