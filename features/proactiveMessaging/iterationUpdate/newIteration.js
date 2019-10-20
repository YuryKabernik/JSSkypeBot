const cron = require('node-cron');
const { guid } = require('../utils/guid.js');
const Injection = require('../../../configuration/registerTypes.js');
const { answers } = require('../messageProperties/answers.js');
const { cronDateExpression } = require('../utils/cronDateExpression.js');

class NewIteration {
    constructor() {
        this.scheduledIterationNotifications = [];
        this.logger = Injection.getInstance('Common.Logger', __filename);
        this.iterations = Injection.getInstance('DAL.IterationRepository');
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
    }

    async addIterations(iterations = []) {
        for (let index = 0; index < iterations.length; index++) {
            const iteration = iterations[index];
            const id = guid(iteration.path + iteration.date);
            await this.iterations.save({
                id: id,
                data: iteration
            });
            this.logger.logInfo(`New iteration saved ${ iteration.path }`);
        }
    }

    async schedule(sendEventCallback) {
        const conversationReferences = await this.conversationReferences.all();
        for (let index = 0; index < conversationReferences.length; index++) {
            const reference = conversationReferences[index];
            await this.scheduleNewIterationsNotification(reference, sendEventCallback);
        }
    }

    async scheduleNewIterationsNotification(conversationReference, sendEventCallback) {
        const avaliableIterations = await this.iterations.all();
        avaliableIterations.forEach(iteration => {
            const dateExpression = cronDateExpression(iteration);
            const taskId = guid(iteration.path + iteration.date);
            const scheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    try {
                        const message = this.answersFormatter.format('transferItemsToIteration', { name: iteration.path });
                        await turnContext.sendActivity(message);
                    } catch (error) {
                        this.logger.logError(
                            `Iteration Notification executions failed! Message: ${ error.message } Stack: ${ error.stack }`
                        );
                    } finally {
                        this._removeSheduledCongradulation(taskId, scheduledCongradulation);
                        await this.iterations.remove(taskId);
                    }
                });
            }, { timezone: process.env.Timezone });

            const scheduledEventExists = this.scheduledIterationNotifications.includes(task => task.taskId === taskId);
            if (scheduledEventExists) {
                this.logger.logInfo(`Sheduled iteration event already exists: CRON-DATE-TIME:[${ dateExpression }]`);
                scheduledCongradulation.destroy();
            } else {
                this.logger.logInfo(`New iteration event scheduled: CRON-DATE-TIME:[${ dateExpression }]`);
                this.scheduledIterationNotifications.push({ taskId, scheduledCongradulation });
            }
        });
    }

    _removeSheduledCongradulation(taskId, scheduledCongradulation) {
        scheduledCongradulation.destroy();
        const indexOfConfiguration = this.scheduledIterationNotifications.findIndex(notification => notification.taskId === taskId);
        if (indexOfConfiguration !== -1) {
            this.scheduledIterationNotifications.splice(indexOfConfiguration, 1);
        }
    }
}

module.exports.NewIteration = NewIteration;
