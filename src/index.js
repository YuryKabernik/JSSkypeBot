const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');
const { start } = require('./startup/startupApplication.js');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, process.env.botConfig || 'local.env');
dotenv.config({ path: ENV_FILE });

// Create HTTP server
const server = restify.createServer({
    name: process.env.name || 'do-not-deny-yourself-anything',
    version: process.env.version || '1.0.0'
});

server
    .use(restify.plugins.acceptParser(server.acceptable))
    .use(restify.plugins.bodyParser({ mapParams: false }))
    .listen(process.env.port || process.env.PORT || 3978, () => {
        start(server);
        console.info(`${ server.name } listening to ${ server.url }`);
        console.info('Get Bot Framework Emulator: https://aka.ms/botframework-emulator');
        console.info('To test your bot, see: https://aka.ms/debug-with-emulator');
    });
