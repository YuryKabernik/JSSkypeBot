const uuid = require('uuid/v5');
const cron = require('node-cron');
const Injection = require('../../../configuration/registerTypes.js');
const { answers } = require('../messageProperties/answers.js');
const { cronWeekExpression } = require('../utils/cronWeekExpression.js');

class WeeklyReminder {
    constructor() {
        this.notifications = [];
        this.sheduledWeeklyNotifications = Injection.getInstance('DAL.NotificationRepository');
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
        this.logger = Injection.getInstance('Common.Logger', __filename);
    }

    add(notificationData) {
        if (notificationData && notificationData.length) {
            this.logger.logInfo(
                `Add new weekly notifications ${ notificationData }`
            );
            this.notifications = this.notifications.concat(notificationData);
        } else if (notificationData) {
            this.logger.logInfo(
                `Add new weekly notification ${ notificationData.date } with message: ${ notificationData.message }`
            );
            this.notifications.push(notificationData);
        }
    }

    shedule(sendEventCallback) {
        this.conversationReferences.all.forEach(conversationReference => {
            this.logger.logInfo(`Sheduling weekly event on conversationReference:[${ JSON.stringify(conversationReference) }]`);
            this.sheduleNewIterationsNotification(conversationReference, sendEventCallback);
        });
    }

    sheduleNewIterationsNotification(conversationReference, sendEventCallback) {
        this.notifications.forEach(notificationData => {
            const dateExpression = cronWeekExpression(notificationData.date);
            const taskId = uuid(dateExpression, process.env.MicrosoftAppId);
            const sheduledNotification = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    const message = this.answersFormatter.lookup('fillYourMyTimeJournal');
                    await turnContext.sendActivity(notificationData.message.trim() ? notificationData.message : message);
                });
            }, { timezone: process.env.Timezone });

            const sheduledEventExists = this.sheduledWeeklyNotifications.includes(taskId);
            if (sheduledEventExists) {
                this.logger.logInfo(`Sheduled event already exists: CRON-DATE-TIME:[${ dateExpression }]`);
                sheduledNotification.destroy();
            } else {
                this.logger.logInfo(`New event sheduled: CRON-DATE-TIME:[${ dateExpression }]`);
                this.sheduledWeeklyNotifications.save({ taskId, sheduledNotification });
            }
        });
    }
}

module.exports.WeeklyReminder = WeeklyReminder;
