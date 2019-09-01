const { ActivityHandler } = require('botbuilder');
const { AnswerDecision } = require('./features/answerDecision.js');

class SkypeBot extends ActivityHandler {
    constructor(botId) {
        super();
        this.botId = botId;
        this.answerDecision = new AnswerDecision(botId);
        this._assignOnMembersAdded();
        this._assignOnMessageAction();
        this._assignOnMemberRemovedActivity();
    }

    _assignOnMessageAction() {
        this.onMessage(async (context, next) => {
            const botMessage = this.answerDecision
                .answerOnMembersRemoteWork(
                    context.activity.text,
                    context.activity.from.name
                );
            await context.sendActivity(botMessage);
            await next();
        });
    }

    _assignOnMemberRemovedActivity() {
        this.onMembersRemoved(async (context, next) => {
            const membersRemoved = context.activity.membersRemoved;
            for (let cnt = 0; cnt < membersRemoved.length; ++cnt) {
                const goodbyMessage = this.answerDecision.answerToRemovedMember(
                    membersRemoved[cnt].id,
                    context.activity.from.name,
                    this.botId
                );
                await context.sendActivity(goodbyMessage);
            }
            await next();
        });
    }

    _assignOnMembersAdded() {
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                const welcomMessage = this.answerDecision.answerToNewMember(
                    membersAdded[cnt].id,
                    this.botId
                );
                await context.sendActivity(welcomMessage);
            }
            await next();
        });
    }
}

module.exports.SkypeBot = SkypeBot;
