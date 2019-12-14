import { INotification } from "./interfaces/INotification";
import { Injection } from "../configuration/registerTypes.js";
import { ILogger } from "../common/interfaces/ILogger";
import * as Notifiactions from "./Queries/notifications.js";

export class NotificationRepository {
    private _logger: ILogger;
    _dbClient: any;

    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient', 'ReferenceRepository');
    }

    async all() {
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

    async getById(id: string) {
        let result = null;
        try {
            result = await this._dbClient.request(Notifiactions.GetNotificationById, id);
        } catch (error) {
            this._logger.logError(error);
        }
        return (result.recordset || [])[0];
    }

    async includes(id: string) {
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
     * @param {Object} notification.data Notification data to store.
     * @param {Object} notification.data.executionDate DateTime of when this notification should be executed.
     * @param {Object} [notification.data.userMessage] Message that should be displayed to the user.
     * @param {Object} [notification.data.creationDate] DateTime of notification creation.
     */
    async save(notificationData: INotification) {
        let result = null;
        try {
            result = await this._dbClient.request(
                Notifiactions.SaveNotification,
                {
                    id: notificationData.id,
                    notification: notificationData.notification
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
