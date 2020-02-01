const Injection = require('../configuration/registerTypes.js');
const { Iterations } = require('./Queries/iterations.js');

class IterationRepository {
    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient', 'ReferenceRepository');
    }

    async all() {
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

    async getById(id) {
        let result = null;
        try {
            result = await this._dbClient.request(Iterations.GetIterationById, id);
        } catch (error) {
            this._logger.logError(error);
        }
        return result && (result.recordset || [])[0];
    }

    async includes(id) {
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
     * @param {Object} iteration Iteration data that need to be stored.
     * @param {String} iteration.id Iteration id.
     * @param {Object} iteration.data Iteration data.
     * @param {String} iteration.data.path The name of iteration that should be displayed to the user.
     * @param {Date|String} iteration.data.date DateTime of iteration creation.
     */
    async save(iteration) {
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

    async remove(id) {
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

module.exports.IterationRepository = IterationRepository;
