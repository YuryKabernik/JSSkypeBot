const { ActivityHandler } = require('botbuilder');
const { AnswerDecision } = require('./features/answerDecision.js');

class SkypeBot extends ActivityHandler {
    constructor(botId) {
        super();
        this.botId = botId;
        this.answerDecision = new AnswerDecision(botId);
        this._assignOnMembersAdded();
        this._assignOnMessageAction();
        this._assignOnTurnAction();
        this._assignOnMembersRemovedAction();
    }

    _assignOnMessageAction() {
        this.onMessage(async (context, next) => {
            if (!context.activity.conversation.isGroup) {
                await this.answerOnRemoteWorkMessage(context);
            }
            await next();
        });
    }

    _assignOnTurnAction() {
        this.onTurn(async (context, next) => {
            if (context.activity.conversation.isGroup) {
                await this.answerOnRemoteWorkMessage(context);
            }
            await next();
        });
    }

    _assignOnMembersRemovedAction() {
        this.onMembersRemoved(async (context, next) => {
            const membersRemoved = context.activity.membersRemoved;
            for (let cnt = 0; cnt < membersRemoved.length; ++cnt) {
                const memberId = membersRemoved[cnt].id;
                const memberName = membersRemoved[cnt].name;
                const goodbyMessage = this.answerDecision.answerToRemovedMember(
                    memberId,
                    memberName,
                    this.botId
                );
                if (goodbyMessage) {
                    await context.sendActivity(goodbyMessage);
                }
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
                if (welcomMessage) {
                    await context.sendActivity(welcomMessage);
                }
            }
            await next();
        });
    }

    async answerOnRemoteWorkMessage(context) {
        if (context.activity.text) {
            const memberName = context.activity.from.name;
            const botMessage = this.answerDecision
                .answerOnMembersRemoteWork(context.activity.text, memberName);
            if (botMessage) {
                await context.sendActivity(botMessage);
            }
        }
    }
}

module.exports.SkypeBot = SkypeBot;
