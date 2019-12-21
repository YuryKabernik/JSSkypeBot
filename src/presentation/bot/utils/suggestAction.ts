import { MessageFactory, TurnContext, CardAction } from 'botbuilder';

export async function send(turnContext: TurnContext, actions: (string | CardAction)[], message: string) {
    var reply = MessageFactory.suggestedActions(actions, message);
    await turnContext.sendActivity(reply);
}
