import { BotFrameworkAdapter } from "botbuilder";
import { Server } from "restify";
import { Injection, registerTypes } from "../configuration/registerTypes";
import Middleware from './middleware';
import { restoreScheduledEventsAsync } from "./restore";
import Routing from './routing';

/**
 * @file Startup Application - executes a sequence of configurations.
 */

export function start(server: Server) {
    registerTypes();

    const logger = Injection.getInstance('Common.Logger', __filename);
    const skypeBot = Injection.getInstance('Bot.SkypeBot');
    const adapter: BotFrameworkAdapter = Injection.getInstance('Bot.Adapter');

    Middleware.Register(adapter);
    Routing.Register(server);

    const continueConversationCallback = (conversation: any, asyncCallback: any) => adapter.continueConversation(conversation, asyncCallback);
    const errorHandler = (error: Error) => logger.logError(`[Promise CATCH -> ${ __filename }] : ${ error }`);
    setTimeout(async () =>
        await restoreScheduledEventsAsync(skypeBot, continueConversationCallback, errorHandler), 5000
    );
};
