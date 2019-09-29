const cron = require('node-cron');
const uuid = require('uuid/v5');
const Injection = require('../../../configuration/registerTypes.js');
const { answers } = require('../messageProperties/answers.js');
const { cronDateExpression } = require('../utils/cronDateExpression.js');

class NewIteration {
    constructor() {
        this.iterations = [];
        this.sheduledIterationNotifications = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
        this.logger = Injection.getInstance('Common.Logger', __filename);
    }

    addIterations(iterations = []) {
        this.logger.logInfo(`Add iterations ${ iterations.map(i => JSON.stringify(i)).join('+') }`);
        this.iterations = this.iterations.concat(iterations);
    }

    shedule(sendEventCallback) {
        this.conversationReferences.all.forEach(conversationReference => {
            this.logger.logInfo(`Sheduled event on conversationReference:[${ JSON.stringify(conversationReference) }]`);
            this.sheduleNewIterationsNotification(conversationReference, sendEventCallback);
        });
    }

    sheduleNewIterationsNotification(conversationReference, sendEventCallback) {
        this.iterations.forEach(iteration => {
            const dateExpression = cronDateExpression(iteration);
            const taskId = uuid(dateExpression + iteration.name, process.env.MicrosoftAppId);
            const sheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    const message = this.answersFormatter.format('transferItemsToIteration', { name: iteration.name });
                    await turnContext.sendActivity(message);
                    this._removeSheduledCongradulation(taskId, sheduledCongradulation);
                    this._removeIteration(iteration);
                });
            }, { timezone: process.env.Timezone });

            const sheduledEventExists = this.sheduledIterationNotifications.map(task => task.taskId).includes(taskId);
            if (sheduledEventExists) {
                this.logger.logInfo(`Sheduled event already exists: CRON-DATE-TIME:[${ dateExpression }]`);
                sheduledCongradulation.destroy();
            } else {
                this.logger.logInfo(`New event sheduled: CRON-DATE-TIME:[${ dateExpression }]`);
                this.sheduledIterationNotifications.push({ taskId, sheduledCongradulation });
            }
        });
    }

    _removeSheduledCongradulation(taskId, sheduledCongradulation) {
        sheduledCongradulation.destroy();
        const indexOfConfiguration = this.sheduledIterationNotifications.findIndex(notification => notification.taskId === taskId);
        if (indexOfConfiguration !== -1) {
            this.sheduledIterationNotifications.splice(indexOfConfiguration, 1);
        }
    }

    _removeIteration(iteration) {
        const indexOfIteration = this.iterations.indexOf(iteration);
        this.iterations.splice(indexOfIteration, 1);
    }
}

module.exports.NewIteration = NewIteration;
