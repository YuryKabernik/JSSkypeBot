/**
 * @file Startup Application - executes a sequence of configurations.
 */

const { restoreScheduledEventsAsync } = require('./restore.js');
const Injection = require('../configuration/registerTypes.js');

module.exports.start = function ({ skypeBot, adapter }) {
    const logger = Injection.getInstance('Common.Logger', __filename);
    setTimeout(async () => await restoreScheduledEventsAsync(
        skypeBot,
        (conversationReference, asyncCallback) => adapter.continueConversation(conversationReference, asyncCallback),
        error => logger.logError(`[Promise CATCH -> ${ __filename }]: ${ error }`)
    ), 5000);
};
