import { ConversationReference, TurnContext } from 'botbuilder-core';
import * as cron from 'node-cron';
import { Timezone } from 'tz-offset';
import { ILogger } from "../../../common/interfaces/ILogger";
import { Injection } from '../../../configuration/registerTypes';
import { IIterationInfo } from "../../../storage/interfaces/IIteration";
import { IterationRepository } from '../../../storage/IterationRepository';
import { ReferenceRepository } from '../../../storage/ReferenceRepository';
import { AnswersFormatter } from '../../answersFormatter';
import answers from '../messageProperties/answers';
import { cronDateExpression } from '../utils/cronDateExpression';
import { guid } from '../utils/guid';
import { ScheduledTask } from '../../models/proactive';

export class NewIteration {
    readonly scheduledIterationNotifications: ScheduledTask[];
    readonly logger: ILogger;
    readonly iterations: IterationRepository;
    readonly conversationReferences: ReferenceRepository;
    readonly answersFormatter: AnswersFormatter;
    
    
    constructor() {
        this.scheduledIterationNotifications = [];
        this.logger = Injection.getInstance('Common.Logger', __filename);
        this.iterations = Injection.getInstance('DAL.IterationRepository');
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
    }

    async addIterations(iterations: IIterationInfo[] = []) {
        for (let index = 0; index < iterations.length; index++) {
            const iteration = iterations[index];
            const id = guid(`${ iteration.path } ${ iteration.date }`);
            await this.iterations.save({
                id: id,
                data: iteration
            });
            this.logger.logInfo(`New iteration saved ${ iteration.path }`);
        }
    }

    async schedule(sendEventCallback: Function) {
        const conversationReferences = await this.conversationReferences.all();
        if (!conversationReferences || !conversationReferences.length) {
            this.logger.logInfo('No available conversation references.')
            return;
        }
        for (let index = 0; index < conversationReferences.length; index++) {
            const reference = conversationReferences[index];
            try {
                await this.scheduleNewIterationsNotification(reference, sendEventCallback);
            } catch (error) {
                this.logger.logError(
                    `Scheduling birthday Congradulation for conversation {${reference.conversation.id}} failed!
                    \nMessage: ${ error.message} 
                    \nStack: ${ error.stack}`
                );
            }
        }
    }

    async scheduleNewIterationsNotification(conversationReference: ConversationReference, sendEventCallback: Function) {
        const avaliableIterations = await this.iterations.all();
        if (!avaliableIterations || !avaliableIterations.length) {
            this.logger.logInfo('No available conversation references.')
            return;
        }
        avaliableIterations.forEach(iteration => {
            const dateExpression = cronDateExpression(iteration.data.date);
            const scheduleOptions: cron.ScheduleOptions = {
                timezone: process.env.Timezone as Timezone
            };

            const scheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext: TurnContext) => {
                    try {
                        const message = this.answersFormatter.format('transferItemsToIteration', { name: iteration.data.path });
                        await turnContext.sendActivity(message);
                    } catch (error) {
                        this.logger.logError(
                            `Iteration Notification executions failed! Message: ${ error.message } Stack: ${ error.stack }`
                        );
                    } finally {
                        this._removeSheduledCongradulation(iteration.id, scheduledCongradulation);
                        await this.iterations.remove(iteration.id);
                    }
                });
            }, scheduleOptions);

            const scheduledEventExists = this.scheduledIterationNotifications.find(task => task.id === iteration.id);
            if (scheduledEventExists) {
                this.logger.logInfo(`Sheduled iteration event already exists: CRON-DATE-TIME:[${ dateExpression }]`);
                scheduledCongradulation.destroy();
            } else {
                this.logger.logInfo(`New iteration event scheduled: CRON-DATE-TIME:[${ dateExpression }]`);
                this.scheduledIterationNotifications.push({
                    id: iteration.id,
                    cronTask: scheduledCongradulation
                });
            }
        });
    }

    _removeSheduledCongradulation(id: string, scheduledCongradulation: cron.ScheduledTask) {
        scheduledCongradulation.destroy();
        const indexOfConfiguration = this.scheduledIterationNotifications.findIndex(notification => notification.id === id);
        if (indexOfConfiguration !== -1) {
            this.scheduledIterationNotifications.splice(indexOfConfiguration, 1);
        }
    }
}
