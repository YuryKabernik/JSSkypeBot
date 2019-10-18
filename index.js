const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');
const { start } = require('./startup/startupApplication.js');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

// Create HTTP server
const server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser({ mapParams: false }));

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.info(`${ server.name } listening to ${ server.url }`);
    console.info(`Get Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.info(`To test your bot, see: https://aka.ms/debug-with-emulator`);
    start(server);
});
