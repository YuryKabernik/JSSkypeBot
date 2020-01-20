const cron = require('node-cron');
const { guid } = require('../utils/guid.js');
const Injection = require('../../../configuration/registerTypes.js');
const { cronDateExpression } = require('../utils/cronDateExpression.js');

class HolidaySheduler {
    constructor(holidays) {
        this.holidays = holidays;
        this.scheduledCongradulations = [];
        this.conversationReferences = Injection.getInstance('DAL.ReferenceRepository');
        this._logger = Injection.getInstance('Common.Logger', 'Сongratulator');
    }

    async schedule(sendEventCallback) {
        const conversationReferences = await this.conversationReferences.all();
        conversationReferences.forEach(reference => {
            this._logger.logInfo(`Scheduling holidays congradulations to the conversation: ${ reference.conversation.id }`);
            this.scheduleHolidaysCongraduloations(reference, sendEventCallback);
        });
    }

    scheduleHolidaysCongraduloations(conversationReference, sendEventCallback) {
        this.holidays.forEach(holidayDate => {
            const dateExpression = cronDateExpression(holidayDate);
            const taskId = guid(dateExpression + conversationReference.conversation.id);
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

            const scheduledEventExists = this.scheduledCongradulations.filter(sc => sc.taskId === taskId)[0];
            if (scheduledEventExists) {
                this._logger.logInfo(`Holiday notification destroyed - taskId: ${ taskId }`);
                scheduledCongradulation.destroy();
            } else {
                this._logger.logInfo(`Holiday notification scheduled - taskId: ${ taskId }`);
                this.scheduledCongradulations.push({ scheduledCongradulation, taskId });
            }
        });
    }
}

module.exports.HolidaySheduler = HolidaySheduler;
