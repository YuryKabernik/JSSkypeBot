const cron = require('node-cron');
const uuid = require('uuid/v5');
const monthList = require('../../../common/months.json');
const Injection = require('../../../configuration/registerTypes.js');
const { generateCronDateExpression } = require('../utils/generateCronDateExpression.js');

class HolidaySheduler {
    constructor(holidays) {
        this.holidays = holidays;
        this.sheduledCongradulations = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.months = monthList;
    }

    shedule(sendEventCallback) {
        this.conversationReferences.all.forEach(conversationReference => {
            this.sheduleHolidaysCongraduloations(conversationReference, sendEventCallback);
        });
    }

    sheduleHolidaysCongraduloations(conversationReference, sendEventCallback) {
        this.holidays.forEach(holidayDate => {
            const dateExpression = generateCronDateExpression(holidayDate);
            const taskId = uuid(dateExpression, process.env.MicrosoftAppId);
            const sheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    await turnContext.sendActivity(holidayDate.name);
                    await turnContext.sendActivity(holidayDate.selebration);
                });
            }, { timezone: process.env.Timezone });

            const sheduledEventExists = this.sheduledCongradulations.map(sc => sc.taskId).includes(taskId);
            if (sheduledEventExists) {
                sheduledCongradulation.destroy();
            } else {
                this.sheduledCongradulations.push({ sheduledCongradulation, taskId });
            }
        });
    }
}

module.exports.HolidaySheduler = HolidaySheduler;
