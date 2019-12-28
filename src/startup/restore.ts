import { SkypeBot } from "../presentation/bot/bot";

/**
 * @file Restore bot appliaction reload.
 */

/**
 * This function will restore all Weekly, Iteration and Holiday events on application starup asynchronously.
 */
export async function restoreScheduledEventsAsync(bot: SkypeBot, sendEventCallback: Function, errorHandler: any) {
    await Promise.all([
        bot.holidays.schedule(sendEventCallback),
        bot.congratulator.schedule(sendEventCallback),
        bot.weeklyReminder.schedule(sendEventCallback),
        bot.iterationsNotification.schedule(sendEventCallback)
    ]).catch(errorHandler);
};
