import { ConversationReference, TurnContext } from 'botbuilder';
import * as cron from 'node-cron';
import { Timezone } from 'tz-offset';
import * as monthList from '../../../common/months.json';
import { Injection } from '../../../configuration/registerTypes';
import { ReferenceRepository } from '../../../storage/ReferenceRepository.js';
import { Birthday, ScheduledTask } from '../../models/proactive.js';
import { cronDateExpression } from '../utils/cronDateExpression';
import { guid } from '../utils/guid.js';

export class Сongratulator {
    months: string[];
    birthDates: {[index: string]: Birthday[]};
    scheduledCongradulations: ScheduledTask[];
    conversationReferences: ReferenceRepository;
    logger: any;
    
    constructor(birthDates: {[index: string]: Birthday[]} = {}) {
        this.months = monthList;
        this.birthDates = birthDates;
        this.scheduledCongradulations = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
    }

    async schedule(sendEventCallback: Function) {
        const conversationReferences = await this.conversationReferences.all();
        conversationReferences.forEach(conversationReference => {
            const congradulatinGroupExists =
                conversationReference.conversation.name &&
                conversationReference.conversation.isGroup &&
                this.birthDates[conversationReference.conversation.name];

            if (congradulatinGroupExists) {
                this.scheduleBirthdayCongraduloations(conversationReference, sendEventCallback);
            }
        });
    }

    scheduleBirthdayCongraduloations(conversationReference: ConversationReference, sendEventCallback: Function) {
        const birthDates = this.birthDates[conversationReference.conversation.name];
        birthDates.forEach((birthday: Birthday) => {
            const dateExpression = cronDateExpression(birthday.date);
            const taskId = guid(dateExpression);
            const scheduleOptions: cron.ScheduleOptions = {
                timezone: process.env.Timezone as Timezone
            };
            
            const scheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext: TurnContext) => {
                    try {
                        await turnContext.sendActivity(`С днём рождения, <at>${ birthday.name }</at>!`);
                    } catch (error) {
                        this.logger.logError(
                            `Birthday Notification for ${ birthday.name } executions failed! Message: ${ error.message } Stack: ${ error.stack }`
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
