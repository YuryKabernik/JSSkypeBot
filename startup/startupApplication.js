/**
 * @file Startup Application - executes a sequence of configurations.
 */

const { restoreScheduledEventsAsync, restoreServiceTrust } = require('./restore.js');
const Container = require('../configuration/registerTypes.js');

module.exports.start = function (server) {
    Container.registerTypes();

    const logger = Container.getInstance('Common.Logger', __filename);
    const skypeBot = Container.getInstance('Bot.SkypeBot');
    const adapter = Container.getInstance('Bot.Adapter');

    const errorHandler = error => logger.logError(`[Promise CATCH -> ${ __filename }] : ${ error }`);
    const continueConversationCallback =
        (conversationReference, asyncCallback) => adapter.continueConversation(conversationReference, asyncCallback);
    setTimeout(async () => {
        await restoreServiceTrust(skypeBot, errorHandler);
        await restoreScheduledEventsAsync(skypeBot, continueConversationCallback, errorHandler);
    }, 5000);
};
