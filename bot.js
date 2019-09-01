const { ActivityHandler } = require('botbuilder');
const { AnswersFormatter } = require('./features/answersFormatter.js');

class SkypeBot extends ActivityHandler {
    constructor() {
        super();
        this._assignOnMembersAdded();
        this._assignOnMessageAction();
        this._assignOnMemberRemovedActivity();
    }

    _assignOnMessageAction() {
        this.onMessage(async (context, next) => {
            const botMessage = AnswersFormatter.format('doNotDenyYourselfAnything', { name: context.activity.from.name });
            await context.sendActivity(botMessage); // replace by message parsing.
            await next();
        });
    }

    _assignOnMemberRemovedActivity() {
        this.onMembersRemoved(async (context, next) => {
            const goodbyMessage = (context.activity.from.name === 'bot' || context.activity.from.name === 'Bot') ?
                AnswersFormatter.lookup('botRemoveLastWords') : AnswersFormatter.format('goodbyeToTheUser', { name: context.activity.from.name });
            await context.sendActivity(goodbyMessage);
            await next();
        });
    }

    _assignOnMembersAdded() {
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    const welcomMessage = AnswersFormatter.lookup('welcomToTheWLNTeam');
                    await context.sendActivity(welcomMessage);
                }
            }
            await next();
        });
    }
}

module.exports.SkypeBot = SkypeBot;
