const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');
const { registerTypes } = require('./configuration/registerTypes.js');
const { start } = require('./startup/startupApplication.js');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

// Create HTTP server
const server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser({ mapParams: false }));

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Proactive messaging callback.
const sendEventCallback = (conversationReference, asyncCallback) => adapter.continueConversation(conversationReference, asyncCallback);

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError]: ${ error }`);
    await context.sendActivity(`Oops. Something went wrong!`); // Send a message to the user
};

const injecType = registerTypes();

// This bot's main dialog.
// Create the main dialog.
const skypeBot = injecType('Common.SkypeBot');
const logger = injecType('Common.Logger', __filename);
const referenceRepository = injecType('DAL.ReferenceRepository');

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (!skypeBot.id) {
            skypeBot.id = context.activity.recipient.id;
        }
        const conversationReference = TurnContext.getConversationReference(context.activity);
        await referenceRepository.save(conversationReference);
        await skypeBot.run(context);
    });
});

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

function sendResponse(res, statusCode, errMessage) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(statusCode);
    res.write(`<html><body><h1>${ errMessage }</h1></body></html>`);
    res.end();
}

server.listen(process.env.port || process.env.PORT || 3978, () => {
    logger.logInfo(`${ server.name } listening to ${ server.url }`);
    logger.logInfo(`Get Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    logger.logInfo(`To test your bot, see: https://aka.ms/debug-with-emulator`);
    start({ skypeBot, adapter });
});
