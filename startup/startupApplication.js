/**
 * @file Startup Application - executes a sequence of configurations.
 */

const { Routing } = require('./routing.js');
const { restoreScheduledEventsAsync } = require('./restore.js');
const Container = require('../configuration/registerTypes.js');
const Middleware = require('./middleware.js');

module.exports.start = function (server) {
    Container.registerTypes();

    const logger = Container.getInstance('Common.Logger', __filename);
    const skypeBot = Container.getInstance('Bot.SkypeBot');
    const adapter = Container.getInstance('Bot.Adapter');

    Middleware.Register(adapter);
    Routing.Register(server);

    const continueConversationCallback = (conversation, asyncCallback) => adapter.continueConversation(conversation, asyncCallback);
    const errorHandler = error => logger.logError(`[Promise CATCH -> ${ __filename }] : ${ error }`);
    setTimeout(async () =>
        await restoreScheduledEventsAsync(skypeBot, continueConversationCallback, errorHandler), 5000
    );
};
