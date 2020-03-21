/**
 * @file Configures bot adapter.
 */

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

module.exports.botAdapter = function () {
    // Create adapter.
    // See https://aka.ms/about-bot-adapter to learn more about how bots work.
    const adapter = new BotFrameworkAdapter({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });

    // Catch-all for errors.
    // + https://nodejs.org/api/process.html
    // + https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
    // + https://nodejs.org/api/process.html#process_event_unhandledrejection
    adapter.onTurnError = async (context, error) => {
        console.error(`\n [onTurnError]: ${ error }`);
        console.error(`\n [onTurnError]: ${ error.stack }`);
        await context.sendActivity(`Oops. Something went wrong!`); // Send a message to the user
    };

    return adapter;
};
