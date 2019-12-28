import { BotFrameworkAdapter } from 'botbuilder';
import { ILogger } from '../../../common/interfaces/ILogger';
import { Injection } from '../../../configuration/registerTypes';
import { Request, Response } from 'restify';
import { SkypeBot } from '../../bot/bot';

/**
 * Notification REST controller
 */
export class Notifications {
    readonly sendEventCallback: (conversationReference: any, asyncCallback: any) => any;
    readonly adapter: BotFrameworkAdapter;
    readonly skypeBot: SkypeBot;
    readonly logger: ILogger;

    constructor() {
        this.adapter = Injection.getInstance('Bot.Adapter');
        this.skypeBot = Injection.getInstance('Bot.SkypeBot');
        this.logger = Injection.getInstance('Common.Logger', __filename);

        // Proactive messaging callback.
        this.sendEventCallback = (conversationReference: any, asyncCallback: any) =>
            this.adapter.continueConversation(conversationReference, asyncCallback);
    }

    /**
     * Listen for incomming information about new iterations notification.
     */
    async iterations(req: Request, res: Response) {
        this.logger.logInfo(`New iterations income ${JSON.stringify(req.body)}`);
        try {
            let iterations = [];
            if (req.body && typeof req.body === 'object') {
                iterations = req.body.iterations;
            } else if (req.body) {
                req.body = JSON.parse(req.body);
                iterations = req.body.iterations;
            }
            await this.skypeBot.iterationsNotification.addIterations(iterations);
            await this.skypeBot.iterationsNotification.schedule(this.sendEventCallback);
        } catch (error) {
            sendResponse(res, 500, 'Unable to handle your request.');
            throw error;
        }
        sendResponse(res, 200, 'New Iterations have been sheduled!');
    }

    /**
     * Listen for incomming information about new weekly notification.
     */
    async weekly(req: Request, res: Response) {
        this.logger.logInfo(`New weekly events income ${JSON.stringify(req.body)}`);
        try {
            let weekEvents = [];
            if (req.body && typeof req.body === 'object') {
                weekEvents = req.body.weekEvents;
            } else if (req.body) {
                req.body = JSON.parse(req.body);
                weekEvents = req.body.weekEvents;
            }
            await this.skypeBot.weeklyReminder.add(weekEvents);
            await this.skypeBot.weeklyReminder.schedule(this.sendEventCallback);
        } catch (error) {
            sendResponse(res, 500, 'Unable to handle your request. Is your request body correct?');
            throw error;
        }
        sendResponse(res, 200, 'New Iterations have been sheduled!');
    }
}

function sendResponse(res: Response, statusCode: number, errMessage: string) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(statusCode);
    res.write(`<html><body><h1>${errMessage}</h1></body></html>`);
    res.end();
}
