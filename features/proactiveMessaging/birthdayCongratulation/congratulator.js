const cron = require('node-cron');
const guid = require('../utils/guid.js');
const monthList = require('../../../common/months.json');
const Injection = require('../../../configuration/registerTypes.js');
const { cronDateExpression } = require('../utils/cronDateExpression.js');

class Сongratulator {
    constructor(birthDates = []) {
        this.months = monthList;
        this.birthDates = birthDates;
        this.scheduledCongradulations = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
    }

    async schedule(sendEventCallback) {
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

    scheduleBirthdayCongraduloations(conversationReference, sendEventCallback) {
        const birthDates = this.birthDates[conversationReference.conversation.name] || [];
        birthDates.forEach(birthdayDate => {
            const dateExpression = cronDateExpression(birthdayDate);
            const taskId = guid(dateExpression);
            const scheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    try {
                        await turnContext.sendActivity(`С днём рождения, <at>${ birthdayDate.name }</at>!`);
                    } catch (error) {
                        this.logger.logError(
                            `Birthday Notification for ${ birthdayDate.name } executions failed! Message: ${ error.message } Stack: ${ error.stack }`
                        );
                    }
                });
            }, { timezone: process.env.Timezone });

            const scheduledEventExists = this.scheduledCongradulations.map(task => task.taskId).includes(taskId);
            if (scheduledEventExists) {
                scheduledCongradulation.destroy();
            } else {
                this.scheduledCongradulations.push({ taskId, scheduledCongradulation });
            }
        });
    }
}

module.exports.Сongratulator = Сongratulator;
