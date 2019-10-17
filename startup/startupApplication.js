/**
 * @file Startup Application - executes a sequence of configurations.
 */

const { restoreScheduledEventsAsync, restoreServiceTrust } = require('./restore.js');
const Injection = require('../configuration/registerTypes.js');

module.exports.start = function ({ skypeBot, adapter }) {
    const logger = Injection.getInstance('Common.Logger', __filename);
    const errorHandler = error => logger.logError(`[Promise CATCH -> ${ __filename }]: ${ error }`);

    setTimeout(async () => {
        await restoreServiceTrust(skypeBot, errorHandler);
        await restoreScheduledEventsAsync(
            skypeBot,
            (conversationReference, asyncCallback) => adapter.continueConversation(conversationReference, asyncCallback),
            errorHandler
        );
    }, 5000);
};
