const Injector = require('../../../configuration/registerTypes.js');

class Notifications {
    constructor() {
        this.adapter = Injector.getInstance('Bot.Adapter');
        this.skypeBot = Injector.getInstance('Bot.SkypeBot');
        this.logger = Injector.getInstance('Common.Logger', __filename);

        // Proactive messaging callback.
        this.sendEventCallback = (conversationReference, asyncCallback) =>
            this.adapter.continueConversation(conversationReference, asyncCallback);
    }

    /**
     * Listen for incomming information about new iterations notification
     * @param {Request} req Request object.
     * @param {Response} res Responce object.
     */
    async iterations(req, res) {
        this.logger.logInfo(`New iterations income ${ JSON.stringify(req.body) }`);
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

    async weekly(req, res) {
        this.logger.logInfo(`New weekly events income ${ JSON.stringify(req.body) }`);
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

function sendResponse(res, statusCode, errMessage) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(statusCode);
    res.write(`<html><body><h1>${ errMessage }</h1></body></html>`);
    res.end();
}

module.exports.Notifications = Notifications;
