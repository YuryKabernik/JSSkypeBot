const { MessageFactory } = require('botbuilder');

async function send(turnContext, actions, message) {
    const reply = MessageFactory.suggestedActions(actions, message);
    await turnContext.sendActivity(reply);
}

module.exports.send = send;
