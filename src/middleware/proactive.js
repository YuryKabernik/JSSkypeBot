/**
 * @file Proactive messaging processing middleware.
 */
const { MicrosoftAppCredentials } = require('botframework-connector');

/**
 * Restores service trust to the conversation activity.
 */
module.exports.trustServiceUrl = async (context, next) => {
    MicrosoftAppCredentials.trustServiceUrl(context.activity.serviceUrl);
    await next();
};
