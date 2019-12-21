import { ConversationReference, TurnContext } from "botbuilder";
import * as cron from 'node-cron';
import { Timezone } from 'tz-offset';
import { ILogger } from "../../../common/interfaces/ILogger";
import { Injection } from '../../../configuration/registerTypes';
import { INotification } from "../../../storage/interfaces/INotification";
import { NotificationRepository } from "../../../storage/NotificationRepository";
import { ReferenceRepository } from "../../../storage/ReferenceRepository";
import { AnswersFormatter } from "../../answersFormatter";
import answers from '../messageProperties/answers';
import { cronWeekExpression } from '../utils/cronWeekExpression';
import { guid } from '../utils/guid';

export class WeeklyReminder {
    readonly notifications: NotificationRepository;
    readonly scheduledWeeklyNotifications: cron.ScheduledTask[];
    readonly conversationReferences: ReferenceRepository;
    readonly answersFormatter: AnswersFormatter;
    readonly logger: ILogger;

    constructor() {
        this.scheduledWeeklyNotifications = [];
        this.notifications = Injection.getInstance('DAL.NotificationRepository');
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
        this.logger = Injection.getInstance('Common.Logger', __filename);
    }

    async add(notification: INotification | INotification[]) {
        if(!notification) {
            return;
        }
        const notifications = notification as INotification[];
        if (notifications && notifications.length) {
            this.logger.logInfo(`Add new weekly notifications ${ notification }`);
            await this.saveMultiple(notifications);
        } else if (notification) {
            notification = notification as INotification;
            this.logger.logInfo(
                `Add new weekly notification ${ notification.content.date } with message: ${ notification.content.message }`
            );
            await this.saveOne(notification);
        }
    }

    async schedule(sendEventCallback: Function) {
        const references = await this.conversationReferences.all();
        if (!references || !references.length) {
            this.logger.logInfo('No available conversation references.')
            return;
        }
        for (let index = 0; index < references.length; index++) {
            const reference = references[index];
            this.logger.logInfo(`Sheduling weekly event on conversationReference:[${ JSON.stringify(reference) }]`);
            await this.scheduleWeeklyNotification(reference, sendEventCallback);
        }
    }

    async scheduleWeeklyNotification(reference: ConversationReference, sendEventCallback: Function) {
        const notifications = await this.notifications.all();
        notifications.forEach((notification: INotification) => {
            const dateExpression = cronWeekExpression(notification.content.date);
            const scheduleOptions: cron.ScheduleOptions = {
                timezone: process.env.Timezone as Timezone
            }; 

            const scheduledNotification = cron.schedule(dateExpression, () => {
                sendEventCallback(reference, async (turnContext: TurnContext) => {
                    try {
                        const message = this.answersFormatter.lookup('fillYourMyTimeJournal');
                        await turnContext.sendActivity(notification.content.message.trim() ? notification.content.message : message);
                    } catch (error) {
                        this.logger.logError(`Weekly Notification executions failed! Message: ${ error.message } Stack: ${ error.stack }`);
                    }
                });
            }, scheduleOptions);

            const scheduledEventExists = this.scheduledWeeklyNotifications.includes(scheduledNotification);
            if (scheduledEventExists) {
                this.logger.logInfo(`Sheduled event already exists: CRON-DATE-TIME:[${ dateExpression }]`);
                scheduledNotification.destroy();
            } else {
                this.scheduledWeeklyNotifications.push(scheduledNotification)
                this.logger.logInfo(`New event scheduled: CRON-DATE-TIME:[${ dateExpression }]`);
            }
        });
    }

    async saveOne(notification: INotification) {
        const dateExpression = cronWeekExpression(notification.content.date);
        const taskId = guid(dateExpression);
        await this.notifications.save({
            id: taskId,
            content: {
                date: notification.content.date,
                message: notification.content.message,
                creationDate: new Date().toLocaleDateString()
            }
        });
    }

    async saveMultiple(notifications: INotification[]) {
        for (let index = 0; index < notifications.length; index++) {
            const notification = notifications[index];
            const dateExpression = cronWeekExpression(notification.content.date);
            const taskId = guid(dateExpression);
            await this.notifications.save({
                id: taskId,
                content: {
                    date: notification.content.date,
                    message: notification.content.message,
                    creationDate: new Date().toLocaleDateString()
                }
            });
        }
    }
}
