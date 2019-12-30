import { INotification } from "./interfaces/INotification";
import { Injection } from "../configuration/registerTypes";
import { ILogger } from "../common/interfaces/ILogger";
import * as Notifiactions from "./Queries/notifications";
import { DbClient } from "../services/dbClient";

export class NotificationRepository {
    private _logger: ILogger;
    _dbClient: DbClient;

    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient', 'ReferenceRepository');
    }

    async all(): Promise<INotification[]> {
        let result = null;
        try {
            result = await this._dbClient.request(Notifiactions.GetAllNotifications);
        } catch (error) {
            this._logger.logError(error);
        }
        return (result.recordset || []).map((record: { Id: any; ExecutionDate: any; UserMessage: any; CreationDate: any; }) => {
            const { Id, ExecutionDate, UserMessage, CreationDate } = record;
            return { id: Id, date: ExecutionDate, message: UserMessage, creationDate: CreationDate };
        });
    }

    async getById(id: string): Promise<INotification> {
        let result = null;
        try {
            result = await this._dbClient.request(Notifiactions.GetNotificationById, id);
        } catch (error) {
            this._logger.logError(error);
        }
        return (result.recordset || [])[0];
    }

    async includes(id: string): Promise<Boolean> {
        let result = null;
        try {
            result = await this._dbClient.request(Notifiactions.IsNotificationIncluded, id);
        } catch (error) {
            this._logger.logError(error);
        }
        return result.output.isIncluded;
    }

    /**
     * Saves notification by provided id.
     * @param {Object} notification Notification data that need to be stored.
     * @param {String} notification.id Notification id.
     * @param {Object} notification.executionDate DateTime of when this notification should be executed.
     * @param {Object} notification.message Message that should be displayed to the user.
     * @param {Object} [notification.creationDate] DateTime of notification creation.
     */
    async save(notification: INotification): Promise<Boolean> {
        let result = null;
        try {
            result = await this._dbClient.request(
                Notifiactions.SaveNotification,
                {
                    id: notification.id,
                    date: notification.date,
                    message: notification.message,
                    creationDate: notification.creationDate
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

    async remove(id: string): Promise<Boolean> {
        let result = null;
        try {
            result = await this._dbClient.request(Notifiactions.RemoveNotification, id);
        } catch (error) {
            this._logger.logError(error);
        }
        if (result && result.returnValue) {
            return result.returnValue;
        }
        return result;
    }
}
