const Injector = require('../configuration/registerTypes.js');

module.exports.messaging = function (server) {
    const adapter = Injector.getInstance('Bot.Adapter');
    const skypeBot = Injector.getInstance('Bot.SkypeBot');
    const logger = Injector.getInstance('Common.Logger', __filename);

    // Proactive messaging callback.
    const sendEventCallback = (conversationReference, asyncCallback) => adapter.continueConversation(conversationReference, asyncCallback);

    // Listen for incomming information about new iterations notification
    server.post('/api/notify/iterations', async (req, res) => {
        logger.logInfo(`New iterations income ${ JSON.stringify(req.body) }`);
        try {
            let iterations = [];
            if (req.body && typeof req.body === 'object') {
                iterations = req.body.iterations;
            } else if (req.body) {
                req.body = JSON.parse(req.body);
                iterations = req.body.iterations;
            }
            await skypeBot.iterationsNotification.addIterations(iterations);
            await skypeBot.iterationsNotification.schedule(sendEventCallback);
        } catch (error) {
            sendResponse(res, 500, 'Unable to handle your request.');
            throw error;
        }
        sendResponse(res, 200, 'New Iterations have been sheduled!');
    });

    server.post('/api/notify/weekly', async (req, res) => {
        logger.logInfo(`New weekly events income ${ JSON.stringify(req.body) }`);
        try {
            let weekEvents = [];
            if (req.body && typeof req.body === 'object') {
                weekEvents = req.body.weekEvents;
            } else if (req.body) {
                req.body = JSON.parse(req.body);
                weekEvents = req.body.weekEvents;
            }
            await skypeBot.weeklyReminder.add(weekEvents);
            await skypeBot.weeklyReminder.schedule(sendEventCallback);
        } catch (error) {
            sendResponse(res, 500, 'Unable to handle your request. Is your request body correct?');
            throw error;
        }
        sendResponse(res, 200, 'New Iterations have been sheduled!');
    });
};

function sendResponse(res, statusCode, errMessage) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(statusCode);
    res.write(`<html><body><h1>${ errMessage }</h1></body></html>`);
    res.end();
}
