const cron = require('node-cron');
const uuid = require('uuid/v5');
const monthList = require('../../../common/months.json');
const Injection = require('../../../configuration/registerTypes.js');
const { cronDateExpression } = require('../utils/cronDateExpression.js');

class HolidaySheduler {
    constructor(holidays) {
        this.holidays = holidays;
        this.scheduledCongradulations = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this.months = monthList;
    }

    async schedule(sendEventCallback) {
        const conversationReferences = await this.conversationReferences.all();
        conversationReferences.forEach(conversationReference => {
            this.scheduleHolidaysCongraduloations(conversationReference, sendEventCallback);
        });
    }

    scheduleHolidaysCongraduloations(conversationReference, sendEventCallback) {
        this.holidays.forEach(holidayDate => {
            const dateExpression = cronDateExpression(holidayDate);
            const taskId = uuid(dateExpression, process.env.MicrosoftAppId);
            const scheduledCongradulation = cron.schedule(dateExpression, () => {
                sendEventCallback(conversationReference, async (turnContext) => {
                    try {
                        await turnContext.sendActivity(holidayDate.name);
                        await turnContext.sendActivity(holidayDate.selebration);
                    } catch (error) {
                        this.logger.logError(
                            `Holiday Notification executions failed! Message: ${ error.message } Stack: ${ error.stack }`
                        );
                    }
                });
            }, { timezone: process.env.Timezone });

            const scheduledEventExists = this.scheduledCongradulations.map(sc => sc.taskId).includes(taskId);
            if (scheduledEventExists) {
                scheduledCongradulation.destroy();
            } else {
                this.scheduledCongradulations.push({ scheduledCongradulation, taskId });
            }
        });
    }
}

module.exports.HolidaySheduler = HolidaySheduler;
