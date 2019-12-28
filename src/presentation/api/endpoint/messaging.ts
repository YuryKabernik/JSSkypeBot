import { BotFrameworkAdapter } from "botbuilder";
import { TurnContext } from "botbuilder-core";
import { Request, Response } from "restify";
import { Injection } from "../../../configuration/registerTypes";
import { ReferenceRepository } from "../../../storage/ReferenceRepository";
import { SkypeBot } from "../../bot/bot";

/**
 * Bot Messaging controller
 */
export class Messaging {
    readonly adapter: BotFrameworkAdapter;
    readonly references: ReferenceRepository;
    readonly skypeBot: SkypeBot;

    constructor() {
        this.adapter = Injection.getInstance('Bot.Adapter');
        this.skypeBot = Injection.getInstance('Bot.SkypeBot');
        this.references = Injection.getInstance('DAL.ReferenceRepository');
    }

    /**
     * Listen for incoming chat requests.
     */
    async messages(req: Request, res: Response) {
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
