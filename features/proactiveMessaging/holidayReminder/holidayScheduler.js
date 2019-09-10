const cron = require('node-cron');
const uuid = require('uuid/v5');

class HolidaySheduler {
    constructor(holidays) {
        this.holidays = holidays;
        this.conversationReferences = [];
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

    shedule(sendEventCallback) {
        for (const conversationReference of Object.values(this.conversationReferences)) {
            this.sheduleHolidaysCongraduloations(conversationReference, sendEventCallback);
        }
    }

    sheduleHolidaysCongraduloations(conversationReference, sendEventCallback) {
        this.holidays.forEach(holidayDate => {
            const date = new Date(holidayDate.date);
            const month = this.months[date.getMonth()];
            const dateDay = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const dateExpression = `${ seconds } ${ minutes } ${ hours } ${ dateDay } ${ month } *`;
            const taskId = uuid(dateExpression, process.env.MicrosoftAppId);
            const sheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    await turnContext.sendActivity(holidayDate.name);
                    await turnContext.sendActivity(holidayDate.selebration);
                });
            },
            {
                timezone: process.env.Timezone
            });
            const sheduledEventExists = this.sheduledCongradulations.map(sc => sc.taskId).includes(taskId);
            if (sheduledEventExists) {
                sheduledCongradulation.destroy();
            } else {
                this.sheduledCongradulations.push({ sheduledCongradulation, taskId });
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

module.exports.HolidaySheduler = HolidaySheduler;
