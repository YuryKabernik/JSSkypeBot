const Injection = require('../configuration/registerTypes.js');
const { Weekly } = require('./Queries/notifications.js');

class NotificationRepository {
    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient', 'ReferenceRepository');
    }

    async all() {
        let result = null;
        try {
            result = await this._dbClient.request(Weekly.GetAllNotifications);
        } catch (error) {
            this._logger.logError(error);
        }
        return (result.recordset || []).map(record => {
            const { Id, ExecutionDate, UserMessage, CreationDate } = record;
            return { id: Id, date: ExecutionDate, message: UserMessage, creationDate: CreationDate };
        });
    }

    async getById(id) {
        let result = null;
        try {
            result = await this._dbClient.request(Weekly.GetNotificationById, id);
        } catch (error) {
            this._logger.logError(error);
        }
        return (result.recordset || [])[0];
    }

    async includes(id) {
        let result = null;
        try {
            result = await this._dbClient.request(Weekly.IsNotificationIncluded, id);
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
    async save(notification) {
        let result = null;
        try {
            result = await this._dbClient.request(
                Weekly.SaveNotification,
                {
                    id: notification.id,
                    notification: notification.data
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
            result = await this._dbClient.request(Weekly.RemoveNotification, id);
        } catch (error) {
            this._logger.logError(error);
        }
        if (result && result.returnValue) {
            return result.returnValue;
        }
        return result;
    }
}

module.exports.NotificationRepository = NotificationRepository;
