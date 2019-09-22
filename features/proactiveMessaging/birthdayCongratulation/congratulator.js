const cron = require('node-cron');
const uuid = require('uuid/v5');
const monthList = require('../../../common/months.json');
const Injection = require('../../../configuration/registerTypes.js');

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
            const date = new Date(birthdayDate.date);
            const month = this.months[date.getMonth()];
            const dateDay = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const dateExpression = `${ seconds } ${ minutes } ${ hours } ${ dateDay } ${ month } *`;
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

    addConversationReference(conversationReference) {
        const conversationId = conversationReference.conversation.id;
        const conversationName = conversationReference.conversation.name;
        const conversationIds = Object.keys(this.conversationReferences);
        if (!!this.birthDates[conversationName] && !conversationIds.includes(conversationId)) {
            this.conversationReferences[conversationId] = conversationReference;
        }
    }
}

module.exports.Сongratulator = Сongratulator;
