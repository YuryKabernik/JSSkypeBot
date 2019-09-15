const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

// This bot's main dialog.
const { SkypeBot } = require('./bot');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

// Create HTTP server
const server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser({ mapParams: false }));

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo test your bot, see: https://aka.ms/debug-with-emulator`);
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError]: ${ error }`);
    await context.sendActivity(`Oops. Something went wrong!`); // Send a message to the user
};

// Create the main dialog.
const skypeBot = new SkypeBot();

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        skypeBot.id = context.activity.recipient.id;
        await skypeBot.run(context);
    });
});

// Listen for incomming information about new iterations notification
server.post('/api/notify/iterations', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    try {
        let iterations = [];
        if (req.body && typeof req.body === 'object') {
            iterations = req.body.iterations;
        } else if (req.body) {
            req.body = JSON.parse(req.body);
            iterations = req.body.iterations;
        }
        skypeBot.iterationsNotification.addIterations(iterations);
        skypeBot.iterationsNotification.shedule(
            (conversationReference, asyncCallback) => adapter.continueConversation(conversationReference, asyncCallback)
        );
    } catch (error) {
        sendResponse(res, 500, 'Unable to handle your request. Is your request body correct?');
        throw error;
    }
    sendResponse(res, 200, 'New Iterations have been sheduled!');
});

// Listen for incoming notifications and send proactive messages to users.
server.get('/api/notify/shedule', async (req, res) => {
    const sendEventCallback = (conversationReference, asyncCallback) => adapter.continueConversation(conversationReference, asyncCallback);
    skypeBot.congratulator.shedule(sendEventCallback);
    skypeBot.holidays.shedule(sendEventCallback);

    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write('<html><body><h1>Proactive messages have been seted.</h1></body></html>');
    res.end();
});

function sendResponse(res, statusCode, errMessage) {
    res.writeHead(statusCode);
    res.write(`<html><body><h1>${ errMessage }</h1></body></html>`);
    res.end();
}
