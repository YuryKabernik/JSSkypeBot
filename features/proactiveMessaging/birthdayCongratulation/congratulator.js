const cron = require('node-cron');
const uuid = require('uuid/v5');

class Сongratulator {
    constructor(birthDates = []) {
        this.birthDates = birthDates;
        this.conversationReferences = {};
        this.sheduledCongradulations = [];
        this.months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
    }

    containsKey(conversationName) {
        return !!this.birthDates[conversationName];
    }

    shedule(sendEventCallback) {
        for (const conversationReference of Object.values(this.conversationReferences)) {
            const congradulatinGroupExists =
                conversationReference.conversation.name &&
                conversationReference.conversation.isGroup &&
                this.birthDates[conversationReference.conversation.name];

            if (congradulatinGroupExists) {
                this.sheduleBirthdayCongraduloations(conversationReference, sendEventCallback);
            }
        }
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
            });
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
        if (this.containsKey(conversationName) && !conversationIds.includes(conversationId)) {
            this.conversationReferences[conversationId] = conversationReference;
        }
    }
}

module.exports.Сongratulator = Сongratulator;
