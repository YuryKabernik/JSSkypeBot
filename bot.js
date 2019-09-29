const { ActivityHandler } = require('botbuilder');
const { birthdayDates } = require('./features/proactiveMessaging/birthdayCongratulation/birthdayDates.js');
const { holidays } = require('./features/proactiveMessaging/holidayReminder/holidays.js');
const Injection = require('./configuration/registerTypes.js');

class SkypeBot extends ActivityHandler {
    constructor(botId) {
        super();
        this.id = botId;
        this.holidays = Injection.getInstance('SkypeBot.HolidaySheduler', holidays);
        this.answerDecision = Injection.getInstance('SkypeBot.TextAnswers', botId);
        this.iterationsNotification = Injection.getInstance('SkypeBot.NewIteration');
        this.illnessAnswering = Injection.getInstance('SkypeBot.IllnessAnswering', botId);
        this.congratulator = Injection.getInstance('SkypeBot.Сongratulator', birthdayDates);
        this.weeklyReminder = Injection.getInstance('SkypeBot.WeeklyReminder');
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
                if (this.illnessAnswering.isContainsIllnessPhrase(context.activity.text)) {
                    await this.answerOnSickLeaveMessage(context);
                } else {
                    await this.answerOnRemoteWorkMessage(context);
                }
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
