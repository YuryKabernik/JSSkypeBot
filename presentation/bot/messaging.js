const { TurnContext } = require('botbuilder');
const Injector = require('../configuration/registerTypes.js');

module.exports.messaging = function (server) {
    const adapter = Injector.getInstance('Bot.Adapter');
    const skypeBot = Injector.getInstance('Bot.SkypeBot');
    const references = Injector.getInstance('DAL.ReferenceRepository');

    // Listen for incoming requests.
    server.post('/api/messages', (req, res) => {
        adapter.processActivity(req, res, async (context) => {
            if (!skypeBot.id) {
                skypeBot.id = context.activity.recipient.id;
            }
            const conversationReference = TurnContext.getConversationReference(context.activity);
            await references.save(conversationReference);
            await skypeBot.run(context);
        });
    });
};
