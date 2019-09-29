const cron = require('node-cron');
const uuid = require('uuid/v5');
const monthList = require('../../../common/months.json');
const Injection = require('../../../configuration/registerTypes.js');
const { cronDateExpression } = require('../utils/cronDateExpression.js');

class Сongratulator {
    constructor(birthDates = []) {
        this.months = monthList;
        this.birthDates = birthDates;
        this.sheduledCongradulations = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
    }

    shedule(sendEventCallback) {
        this.conversationReferences.all.forEach(conversationReference => {
            const congradulatinGroupExists =
                conversationReference.conversation.name &&
                conversationReference.conversation.isGroup &&
                this.birthDates[conversationReference.conversation.name];

            if (congradulatinGroupExists) {
                this.sheduleBirthdayCongraduloations(conversationReference, sendEventCallback);
            }
        });
    }

    sheduleBirthdayCongraduloations(conversationReference, sendEventCallback) {
        const birthDates = this.birthDates[conversationReference.conversation.name] || [];
        birthDates.forEach(birthdayDate => {
            const dateExpression = cronDateExpression(birthdayDate);
            const taskId = uuid(dateExpression, process.env.MicrosoftAppId);
            const sheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    await turnContext.sendActivity(`С днём рождения, <at>${ birthdayDate.name }</at>!`);
                });
            }, { timezone: process.env.Timezone });

            const sheduledEventExists = this.sheduledCongradulations.map(task => task.taskId).includes(taskId);
            if (sheduledEventExists) {
                sheduledCongradulation.destroy();
            } else {
                this.sheduledCongradulations.push({ taskId, sheduledCongradulation });
            }
        });
    }
}

module.exports.Сongratulator = Сongratulator;
