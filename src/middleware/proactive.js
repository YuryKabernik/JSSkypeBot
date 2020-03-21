/**
 * @file Proactive messaging processing middleware.
 */
const { MicrosoftAppCredentials } = require('botframework-connector');

/**
 * Restores service trust to the conversation activity.
 */
module.exports.trustServiceUrl = async (context, next) => {
    if (!MicrosoftAppCredentials.isTrustedServiceUrl(context.activity.serviceUrl)) {
        MicrosoftAppCredentials.trustServiceUrl(serviceUrl);
    }
    await next();
};
