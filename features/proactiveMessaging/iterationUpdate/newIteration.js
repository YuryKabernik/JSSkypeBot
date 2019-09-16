const cron = require('node-cron');
const uuid = require('uuid/v5');
const { generateCronDateExpression } = require('../utils/generateCronDateExpression.js');
const { AnswersFormatter } = require('../../answersFormatter.js');
const { answers } = require('../messageProperties/answers.js');

class NewIteration {
    constructor() {
        this.iterations = [];
        this.conversationReferences = {};
        this.sheduledIterationNotifications = [];
        this.answersFormatter = new AnswersFormatter(answers);
    }

    addIterations(iterations = []) {
        this.iterations = this.iterations.concat(iterations);
    }

    shedule(sendEventCallback) {
        for (const conversationReference of Object.values(this.conversationReferences)) {
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
                });
            },
            {
                timezone: process.env.Timezone
            });

            const sheduledEventExists = this.sheduledIterationNotifications.map(task => task.taskId).includes(taskId);
            if (sheduledEventExists) {
                sheduledCongradulation.destroy();
            } else {
                this.sheduledIterationNotifications.push({ taskId, sheduledCongradulation });
            }
        });
    }

    addConversationReference(conversationReference) {
        const conversationId = conversationReference.conversation.id;
        const conversationIds = Object.keys(this.conversationReferences);
        if (!conversationIds.includes(conversationId)) {
            this.conversationReferences[conversationId] = conversationReference;
        }
    }
}

module.exports.NewIteration = NewIteration;
