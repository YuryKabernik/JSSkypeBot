const { ActivityHandler, TurnContext } = require('botbuilder');
const { AnswerDecision } = require('./features/messageAnswering/answerDecision.js');
const { IllnessAnswering } = require('./features/messageAnswering/illnessAnswering.js');
const { Сongratulator } = require('./features/proactiveMessaging/birthdayCongratulation/congratulator.js');
const { birthdayDates } = require('./features/proactiveMessaging/birthdayCongratulation/birthdayDates.js');
const { HolidaySheduler } = require('./features/proactiveMessaging/holidayReminder/holidayScheduler.js');
const { holidays } = require('./features/proactiveMessaging/holidayReminder/holidays.js');

class SkypeBot extends ActivityHandler {
    constructor(botId) {
        super();
        this.id = botId;
        this.answerDecision = new AnswerDecision(botId);
        this.illnessAnswering = new IllnessAnswering(botId);
        this.congratulator = new Сongratulator(birthdayDates);
        this.holidays = new HolidaySheduler(holidays);
        this._assignOnMembersAdded();
        this._assignOnMessageAction();
        this._assignOnTurnAction();
        this._assignOnMembersRemovedAction();
        this._assignConversationReference();
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
                if (this.illnessAnswering.isContainsIllnessPhrase(context.activity.text)) {
                    await this.answerOnSickLeaveMessage(context);
                } else {
                    await this.answerOnRemoteWorkMessage(context);
                }
            }
            await next();
        });
    }

    _assignConversationReference() {
        this.onConversationUpdate(async (context, next) => {
            const conversationReference = TurnContext.getConversationReference(context.activity);
            this.congratulator.addConversationReference(conversationReference);
            this.holidays.addConversationReference(conversationReference);
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
                    this.id
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
                    this.id
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

    async answerOnSickLeaveMessage(context) {
        if (context.activity.text) {
            const memberName = context.activity.from.name;
            const botMessage = this.illnessAnswering
                .getAnswerMessage(context.activity.text, memberName);
            if (botMessage) {
                await context.sendActivity(botMessage);
            }
        }
    }
}

module.exports.SkypeBot = SkypeBot;
