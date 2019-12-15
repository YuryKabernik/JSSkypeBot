/**
 * @file Proactive messaging processing middleware.
 */
import { MicrosoftAppCredentials } from "botframework-connector";
import { TurnContext } from "botbuilder";

/**
 * Restores service trust to the conversation activity.
 */
export async function trustServiceUrl(context: TurnContext, next: Function) {
    if (MicrosoftAppCredentials.isTrustedServiceUrl(context.activity.serviceUrl)) {
        MicrosoftAppCredentials.trustServiceUrl(context.activity.serviceUrl);
    }
    await next();
};
