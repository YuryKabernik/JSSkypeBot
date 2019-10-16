/**
 * @file Restore notifiactions from database.
 */

/**
 * This function will restore all Weekly, Iteration and Holiday events on application starup asynchronously.
 */
module.exports.restoreScheduledEventsAsync = async function (bot, sendEventCallback, errorHandler) {
    await Promise.all([
        bot.holidays.schedule(sendEventCallback),
        bot.congratulator.schedule(sendEventCallback),
        bot.weeklyReminder.schedule(sendEventCallback),
        bot.iterationsNotification.schedule(sendEventCallback)
    ]).catch(errorHandler);
};
