import { Injection } from '../configuration/registerTypes.js';
import * as Iterations from './Queries/iterations.js';
import { ILogger } from "../common/interfaces/ILogger";
import { IDbClient } from '../services/interfaces/IDbClient.js';
import { IIteration } from './interfaces/IIteration.js';

export class IterationRepository {
    private _logger: ILogger;
    private _dbClient: IDbClient;

    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient', 'ReferenceRepository');
    }

    async all(): Promise<IIteration[]> {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.GetAllIterations);
        } catch (error) {
            this._logger.logError(error);
        }
        return result && (result.recordset || []).map(record => {
            const { ID, Date, Path } = record;
            return { id: ID, date: Date, path: Path };
        });
    }

    async getById(id: string) {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.GetIterationById, id);
        } catch (error) {
            this._logger.logError(error);
        }
        return result && (result.recordset || [])[0];
    }

    async includes(id: string) {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.IsIterationIncluded, id);
        } catch (error) {
            this._logger.logError(error);
            return result;
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
