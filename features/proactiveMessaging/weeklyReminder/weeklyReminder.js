const uuid = require('uuid/v5');
const cron = require('node-cron');
const Injection = require('../../../configuration/registerTypes.js');
const { answers } = require('../messageProperties/answers.js');
const { cronWeekExpression } = require('../utils/cronWeekExpression.js');

class WeeklyReminder {
    constructor() {
        this.scheduledWeeklyNotifications = [];
        this.notifications = Injection.getInstance('DAL.NotificationRepository');
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
        this.logger = Injection.getInstance('Common.Logger', __filename);
    }

    async add(notificationData) {
        if (notificationData && notificationData.length) {
            this.logger.logInfo(`Add new weekly notifications ${ notificationData }`);
            await this.saveMultiple(notificationData);
        } else if (notificationData) {
            this.logger.logInfo(
                `Add new weekly notification ${ notificationData.date } with message: ${ notificationData.message }`
            );
            await this.saveOne(notificationData);
        }
    }

    async schedule(sendEventCallback) {
        const references = await this.conversationReferences.all();
        for (let index = 0; index < references.length; index++) {
            const reference = references[index];
            this.logger.logInfo(`Sheduling weekly event on conversationReference:[${ JSON.stringify(reference) }]`);
            await this.scheduleWeeklyNotification(reference, sendEventCallback);
        }
    }

    async scheduleWeeklyNotification(reference, sendEventCallback) {
        const notifications = await this.notifications.all();
        notifications.forEach(notificationData => {
            const dateExpression = cronWeekExpression(notificationData.date);
            const scheduledNotification = cron.schedule(dateExpression, () => {
                sendEventCallback(reference, async (turnContext) => {
                    try {
                        const message = this.answersFormatter.lookup('fillYourMyTimeJournal');
                        await turnContext.sendActivity(notificationData.message.trim() ? notificationData.message : message);
                    } catch (error) {
                        this.logger.logError(`Weekly Notification executions failed! Message: ${ error.message } Stack: ${ error.stack }`);
                    }
                });
            }, { timezone: process.env.Timezone });

            const scheduledEventExists = this.scheduledWeeklyNotifications.includes(notificationData.id);
            if (scheduledEventExists) {
                this.logger.logInfo(`Sheduled event already exists: CRON-DATE-TIME:[${ dateExpression }]`);
                scheduledNotification.destroy();
            } else {
                this.logger.logInfo(`New event scheduled: CRON-DATE-TIME:[${ dateExpression }]`);
            }
        });
    }

    async saveOne(notification) {
        const dateExpression = cronWeekExpression(notification.date);
        const taskId = uuid(dateExpression, process.env.MicrosoftAppId);
        await this.notifications.save({
            id: taskId,
            data: {
                executionDate: notification.date,
                userMessage: notification.message,
                creationDate: new Date().toLocaleDateString()
            }
        });
    }

    async saveMultiple(notifications) {
        for (let index = 0; index < notifications.length; index++) {
            const notification = notifications[index];
            const dateExpression = cronWeekExpression(notification.date);
            const taskId = uuid(dateExpression, process.env.MicrosoftAppId);
            await this.notifications.save({
                id: taskId,
                data: {
                    date: notification.date,
                    message: notification.message,
                    creationDate: new Date().toLocaleDateString()
                }
            });
        }
    }
}

module.exports.WeeklyReminder = WeeklyReminder;
