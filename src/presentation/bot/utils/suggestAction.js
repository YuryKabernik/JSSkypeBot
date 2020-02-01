const { MessageFactory } = require('botbuilder');

async function send(turnContext, actions, message) {
    var reply = MessageFactory.suggestedActions(actions, message);
    await turnContext.sendActivity(reply);
}

module.exports.send = send;
