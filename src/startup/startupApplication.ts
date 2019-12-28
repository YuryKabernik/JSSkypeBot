import { BotFrameworkAdapter } from 'botbuilder';
import { Server } from 'restify';
import { ILogger } from '../common/interfaces/ILogger';
import { Injection, registerTypes } from "../configuration/registerTypes";
import { SkypeBot } from '../presentation/bot/bot';
import Middleware from './middleware';
import { restoreScheduledEventsAsync } from "./restore";
import Routing from './routing';

/**
 * @file Startup Application - executes a sequence of configurations.
 */

export function start(server: Server) {
    registerTypes();

    const logger: ILogger = Injection.getInstance('Common.Logger', __filename);
    const skypeBot: SkypeBot = Injection.getInstance('Bot.SkypeBot');
    const adapter: BotFrameworkAdapter = Injection.getInstance('Bot.Adapter');

    Middleware.Register(adapter);
    Routing.Register(server);

    const continueConversationCallback = (conversation: any, asyncCallback: any) => adapter.continueConversation(conversation, asyncCallback);
    const errorHandler = (error: Error) => logger.logError(`[Promise CATCH -> ${ __filename }] : ${ error }`);
    setTimeout(async () =>
        await restoreScheduledEventsAsync(skypeBot, continueConversationCallback, errorHandler), 5000
    );
};
