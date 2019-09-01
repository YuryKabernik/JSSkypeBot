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
            const membersRemoved = context.activity.membersRemoved;
            for (let cnt = 0; cnt < membersRemoved.length; ++cnt) {
                const goodbyMessage = (membersRemoved[cnt].id !== context.activity.recipient.id) ?
                    AnswersFormatter.format('goodbyeToTheUser', { name: context.activity.from.name }) :
                    AnswersFormatter.lookup('botRemoveLastWords');
                await context.sendActivity(goodbyMessage);
            }
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
