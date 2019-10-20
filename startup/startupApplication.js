/**
 * @file Startup Application - executes a sequence of configurations.
 */

const { restoreScheduledEventsAsync, restoreServiceTrust } = require('./restore.js');
const { Routing } = require('./routing.js');
const Container = require('../configuration/registerTypes.js');

module.exports.start = function (server) {
    Container.registerTypes();

    Routing.Register(server);

    const logger = Container.getInstance('Common.Logger', __filename);
    const skypeBot = Container.getInstance('Bot.SkypeBot');

    const continueConversationCallback =
        (conversation, asyncCallback) => Container.getInstance('Bot.Adapter')
            .continueConversation(conversation, asyncCallback);
    const errorHandler = error => logger.logError(`[Promise CATCH -> ${ __filename }] : ${ error }`);
    setTimeout(async () => {
        await restoreServiceTrust(skypeBot, errorHandler);
        await restoreScheduledEventsAsync(skypeBot, continueConversationCallback, errorHandler);
    }, 5000);
};
