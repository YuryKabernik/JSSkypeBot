/**
 * @file Configures bot adapter.
 */

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter } from 'botbuilder';

export function botAdapter() {
    // Create adapter.
    // See https://aka.ms/about-bot-adapter to learn more about how bots work.
    const adapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });

    // Catch-all for errors.
    adapter.onTurnError = async (context, error) => {
        console.error(`\n [onTurnError]: ${error}`);
        console.error(`\n [onTurnError]: ${error.stack}`);
        await context.sendActivity(`Oops. Something went wrong!`); // Send a message to the user
    };

    return adapter;
};
