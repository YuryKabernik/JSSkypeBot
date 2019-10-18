/**
 * @file Restore bot appliaction reload.
 */
const { MicrosoftAppCredentials } = require('botframework-connector');

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

/**
 * Restores service trust to the conversations after appication reload.
 */
module.exports.restoreServiceTrust = async function (bot, errorHandler) {
    const restoreByServiceUrl = serviceUrl => MicrosoftAppCredentials.trustServiceUrl(serviceUrl);
    await bot.restoreServiceTrust(restoreByServiceUrl)
        .catch(errorHandler);
};
