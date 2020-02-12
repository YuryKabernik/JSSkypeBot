/**
 * @file Proactive messaging processing middleware.
 */
const { MicrosoftAppCredentials } = require('botframework-connector');

/**
 * Restores service trust to the conversation activity.
 */
module.exports.trustServiceUrl = async (context, next) => {
    const serviceUrl = context.activity.serviceUrl;
    const isUntrusted = !MicrosoftAppCredentials.isTrustedServiceUrl(serviceUrl);
    if (isUntrusted) {
        MicrosoftAppCredentials.trustServiceUrl(serviceUrl);
    }
    await next();
};
