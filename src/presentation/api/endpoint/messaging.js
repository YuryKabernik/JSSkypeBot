const { TurnContext } = require('botbuilder-core');
const Injector = require('../../../configuration/registerTypes.js');

class Messaging {
    constructor() {
        this.adapter = Injector.getInstance('Bot.Adapter');
        this.skypeBot = Injector.getInstance('Bot.SkypeBot');
        this.references = Injector.getInstance('DAL.ReferenceRepository');
    }

    /**
     * Listen for incoming chat requests.
     */
    async messages(req, res) {
        await this.adapter.processActivity(req, res, async (context) => {
            if (!this.skypeBot.id) {
                this.skypeBot.id = context.activity.recipient.id;
            }
            const conversationReference = TurnContext.getConversationReference(context.activity);
            await this.references.save(conversationReference);
            await this.skypeBot.run(context);
        });
    }
}

module.exports.Messaging = Messaging;
