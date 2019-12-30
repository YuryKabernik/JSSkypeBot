import { ConversationReference, TurnContext } from 'botbuilder-core';
import * as cron from 'node-cron';
import { Timezone } from 'tz-offset';
import { ILogger } from '../../../common/interfaces/ILogger';
import * as monthList from '../../../common/months.json';
import { Injection } from '../../../configuration/registerTypes';
import { ReferenceRepository } from '../../../storage/ReferenceRepository';
import { Holiday, ScheduledTask } from '../../models/proactive';
import { cronDateExpression } from '../utils/cronDateExpression';
import { guid } from '../utils/guid';

export class HolidaySheduler {
    holidays: Holiday[];
    scheduledCongradulations: ScheduledTask[];
    conversationReferences: ReferenceRepository;
    months: string[];
    logger: ILogger;

    constructor(holidays: Holiday[]) {
        this.holidays = holidays;
        this.scheduledCongradulations = [];
        this.logger = Injection.getInstance('Common.Logger', 'HolidaySheduler');
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.months = monthList;
    }

    async schedule(sendEventCallback: Function) {
        const conversationReferences = await this.conversationReferences.all();
        if (!conversationReferences || !conversationReferences.length) {
            this.logger.logInfo('No available conversation references.')
            return;
        }
        conversationReferences.forEach((conversationReference: ConversationReference) => {
            try {
                this.scheduleHolidaysCongraduloations(conversationReference, sendEventCallback);
            } catch (error) {
                this.logger.logError(
                    `Scheduling holiday Notification for conversation {${conversationReference.conversation.id}} failed!
                    \nMessage: ${ error.message} 
                    \nStack: ${ error.stack}`
                );
            }
        });
    }

    scheduleHolidaysCongraduloations(conversationReference: ConversationReference, sendEventCallback: Function) {
        this.holidays.forEach(holiday => {
            const dateExpression = cronDateExpression(holiday.date);
            const taskId = guid(dateExpression);
            const scheduleOptions: cron.ScheduleOptions = {
                timezone: process.env.Timezone as Timezone
            };

            const scheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext: TurnContext) => {
                    try {
                        await turnContext.sendActivity(holiday.name);
                        await turnContext.sendActivity(holiday.selebration);
                    } catch (error) {
                        this.logger.logError(
                            `Holiday Notification executions failed! Message: ${error.message} Stack: ${error.stack}`
                        );
                    }
                });
            }, scheduleOptions);

            const scheduledEventExists = this.scheduledCongradulations.find(task => task.id === taskId);
            if (scheduledEventExists) {
                scheduledCongradulation.destroy();
            } else {
                this.scheduledCongradulations.push({
                    id: taskId,
                    cronTask: scheduledCongradulation
                });
            }
        });
    }
}
