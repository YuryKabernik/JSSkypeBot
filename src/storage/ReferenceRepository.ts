import { ConversationReference } from 'botbuilder';
import { ILogger } from '../common/interfaces/ILogger.js';
import { Injection } from '../configuration/registerTypes.js';
import { IDbClient } from '../services/interfaces/IDbClient.js';
import { GetAllReferences, GetReferenceById, SaveReference } from './Queries/references.js';

export class ReferenceRepository {
    private _logger: ILogger;
    readonly _dbClient: IDbClient;

    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient');
    }

    async all(): Promise<ConversationReference[]> {
        let result = null;
        try {
            result = await this._dbClient.request(GetAllReferences);
        } catch (error) {
            this._logger.logError(error);
        }
        return (result.recordset || []).map(record => {
            const { ConversationObject } = record;
            return JSON.parse(ConversationObject);
        });
    }

    async getById(conversationId: string) {
        let result = null;
        try {
            result = await this._dbClient.request(GetReferenceById, conversationId);
        } catch (error) {
            this._logger.logError(error);
        }
        return (result.recordset || []).map(record => {
            const { ConversationObject } = record;
            return JSON.parse(ConversationObject);
        })[0];
    }

    async save(reference: any) {
        let result = null;
        try {
            result = await this._dbClient.request(SaveReference, reference);
        } catch (error) {
            this._logger.logError(error);
        }
        if (result && result.returnValue) {
            return result.returnValue;
        }
        return result;
    }
}
