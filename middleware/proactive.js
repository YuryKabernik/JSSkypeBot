/**
 * @file Proactive messaging processing middleware.
 */
const { MicrosoftAppCredentials } = require('botframework-connector');
const { ActivityTypes } = require('botframework-schema');

/**
 * Restores service trust to the conversation activity.
 */
module.exports.trustServiceUrl = async (context, next) => {
    if (context.activity.type === ActivityTypes.Event) {
        MicrosoftAppCredentials.trustServiceUrl(context.activity.serviceUrl);
    }
    await next();
};
