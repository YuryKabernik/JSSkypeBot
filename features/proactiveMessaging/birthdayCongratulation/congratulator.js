const cron = require('node-cron');
const { guid } = require('../utils/guid.js');
const monthList = require('../../../common/months.json');
const Injection = require('../../../configuration/registerTypes.js');
const { cronDateExpression } = require('../utils/cronDateExpression.js');

class Сongratulator {
    constructor(birthDates = []) {
        this.months = monthList;
        this.birthDates = birthDates;
        this.scheduledCongradulations = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this._logger = Injection.getInstance('Common.Logger', 'Сongratulator');
    }

    async schedule(sendEventCallback) {
        const conversationReferences = await this.conversationReferences.all();
        conversationReferences
            .filter(reference =>
                reference.conversation &&
                reference.conversation.isGroup)
            .forEach(reference => {
                this._logger.logInfo(`Scheduling birthday congradulations to the conversation: ${ reference.conversation.id }`);
                this.scheduleBirthdayCongraduloations(reference, sendEventCallback);
            });
    }

    scheduleBirthdayCongraduloations(conversationReference, sendEventCallback) {
        this.birthDates.forEach(birthdayDate => {
            const dateExpression = cronDateExpression(birthdayDate);
            const taskId = guid(dateExpression + conversationReference.conversation.id);
            const scheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    try {
                        await turnContext.sendActivity(`С днём рождения, *${ birthdayDate.name }*!`);
                    } catch (error) {
                        this._logger.logError(
                            `Birthday Notification for ${ birthdayDate.name } executions failed! Message: ${ error.message } Stack: ${ error.stack }`
                        );
                    }
                });
            }, { timezone: process.env.Timezone });

            const scheduledEventExists = this.scheduledCongradulations.filter(task => task.taskId === taskId)[0];
            if (scheduledEventExists) {
                this._logger.logInfo(`Congradulation destroyed - taskId: ${ taskId }`);
                scheduledCongradulation.destroy();
            } else {
                this._logger.logInfo(`Congradulation scheduled - taskId: ${ taskId }`);
                this.scheduledCongradulations.push({ taskId, scheduledCongradulation });
            }
        });
    }
}

module.exports.Сongratulator = Сongratulator;
