import { ConversationReference } from 'botbuilder-core';
import { ILogger } from '../common/interfaces/ILogger';
import { Injection } from '../configuration/registerTypes';
import { IDbClient } from '../services/interfaces/IDbClient';
import { GetAllReferences, GetReferenceById, SaveReference } from './Queries/references';

export class ReferenceRepository {
    private _logger: ILogger;
    readonly _dbClient: IDbClient;

    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient');
    }

    async all(): Promise<ConversationReference[] | undefined> {
        let result = null;
        try {
            result = await this._dbClient.request(GetAllReferences);
        } catch (error) {
            this._logger.logError(error);
        }
        if(result && result.recordset) {
            return (result.recordset || []).map(record => {
                const { ConversationObject } = record;
                return JSON.parse(ConversationObject);
            });
        }
        return;
    }

    async getById(conversationId: string): Promise<ConversationReference | undefined> {
        let result = null;
        try {
            result = await this._dbClient.request(GetReferenceById, conversationId);
        } catch (error) {
            this._logger.logError(error);
        }
        if(result && result.recordset) {
            return (result.recordset || []).map(record => {
                const { ConversationObject } = record;
                return JSON.parse(ConversationObject);
            })[0];
        }
        return;
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
