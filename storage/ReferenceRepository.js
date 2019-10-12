const Injection = require('../configuration/registerTypes.js');
const { GetReferenceById, GetAllReferences, SaveReference } = require('./Queries/references.js');

class ReferenceRepository {
    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient');
    }

    async all() {
        let result = null;
        try {
            result = await this._dbClient.request(GetAllReferences);
        } catch (error) {
            this._logger.logError(error);
        }
        return result.recordset.map(record => {
            const { ConversationObject } = record;
            return JSON.parse(ConversationObject);
        });
    }

    async getById(conversationId) {
        let result = null;
        try {
            result = await this._dbClient.request(GetReferenceById, conversationId);
        } catch (error) {
            this._logger.logError(error);
        }
        return result.recordset.map(record => {
            const { ConversationObject } = record;
            return JSON.parse(ConversationObject);
        })[0];
    }

    async save(reference) {
        let result = null;
        try {
            result = await this._dbClient.request(SaveReference, reference);
        } catch (error) {
            this._logger.logError(error);
        }
        return result.returnValue;
    }
}

module.exports.ReferenceRepository = ReferenceRepository;
