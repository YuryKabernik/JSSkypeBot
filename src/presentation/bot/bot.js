const { ActivityHandler } = require('botbuilder');
const { reactOnCommand, continueBotDialog } = require('./utils/reactOnCommand.js');
const { birthdayDates } = require('../../features/proactiveMessaging/birthdayCongratulation/birthdayDates.js');
const { holidays } = require('../../features/proactiveMessaging/holidayReminder/holidays.js');
const Injection = require('../../configuration/registerTypes.js');

class SkypeBot extends ActivityHandler {
    constructor(botId) {
        super();
        this.id = botId;
        this.botState = Injection.getInstance('SkypeBot.State');
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
        this._assignOnDialog();
    }

    _assignOnMessageAction() {
        this.onMessage(async (context, next) => {
            if (!context.activity.conversation.isGroup) {
                if (context.commands && context.commands.length) {
                    await this.executeCommands(context, context.commands);
                } else {
                    await this.continueDialog(context);
                }
            }
            await next();
        });
    }

    _assignOnTurnAction() {
        this.onTurn(async (turnContext, next) => {
            if (turnContext.activity.conversation.isGroup) {
                if (this.illnessAnswering.isContainsIllnessPhrase(turnContext.activity.text)) {
                    await this.answerOnSickLeaveMessage(turnContext);
                } else {
                    await this.answerOnRemoteWorkMessage(turnContext);
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

    _assignOnDialog() {
        this.onDialog(async (turnContext, next) => {
            await this.botState.saveChanges(turnContext, false);
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

    async continueDialog(context) {
        await continueBotDialog(context, this.botState);
    }

    async executeCommands(context, commands = []) {
        const commandIncluded = commands.find(command => command.name === 'iteration');
        if (commandIncluded) {
            const command = commands.find(command => command.name === 'iteration');
            await reactOnCommand(command, context, this.botState);
        }
    }
}

module.exports.SkypeBot = SkypeBot;
