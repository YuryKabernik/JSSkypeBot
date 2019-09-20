const cron = require('node-cron');
const uuid = require('uuid/v5');
const { generateCronDateExpression } = require('../utils/generateCronDateExpression.js');
const { AnswersFormatter } = require('../../answersFormatter.js');
const { answers } = require('../messageProperties/answers.js');
const { Logger } = require('../../../common/logger.js');

class NewIteration {
    constructor() {
        this.iterations = [];
        this.conversationReferences = {};
        this.sheduledIterationNotifications = [];
        this.answersFormatter = new AnswersFormatter(answers);
        this.logger = new Logger('NewIteration');
    }

    addIterations(iterations = []) {
        this.logger.logInfo(`Add iterations ${ iterations.map(i => JSON.stringify(i)).join('+') }`);
        this.iterations = this.iterations.concat(iterations);
    }

    shedule(sendEventCallback) {
        for (const conversationReference of Object.values(this.conversationReferences)) {
            this.logger.logInfo(`Sheduled event on conversationReference:[${ JSON.stringify(conversationReference) }]`);
            this.sheduleNewIterationsNotification(conversationReference, sendEventCallback);
        }
    }

    sheduleNewIterationsNotification(conversationReference, sendEventCallback) {
        this.iterations.forEach(iteration => {
            const dateExpression = generateCronDateExpression(iteration);
            const taskId = uuid(dateExpression + iteration.name, process.env.MicrosoftAppId);
            const sheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    const message = this.answersFormatter.format('transferItemsToIteration', { name: iteration.name });
                    await turnContext.sendActivity(message);
                    this._removeSheduledCongradulation(taskId, sheduledCongradulation);
                    this._removeIteration(iteration);
                });
            },
            {
                timezone: process.env.Timezone
            });

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

    addConversationReference(conversationReference) {
        const conversationId = conversationReference.conversation.id;
        const conversationIds = Object.keys(this.conversationReferences);
        if (!conversationIds.includes(conversationId)) {
            this.logger.logInfo(`New conversation registred: ${ conversationId }`);
            this.conversationReferences[conversationId] = conversationReference;
        } else {
            this.logger.logInfo(`Conversation already registred: ${ conversationId }`);
        }
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
