import { ActivityHandler, TurnContext } from 'botbuilder';
import { Injection } from '../../configuration/registerTypes';
import { IllnessAnswering } from '../../features/messageAnswering/illnessAnswering';
import { birthdayDates } from '../../features/proactiveMessaging/birthdayCongratulation/birthdayDates';
import { Сongratulator } from '../../features/proactiveMessaging/birthdayCongratulation/congratulator';
import holidays from '../../features/proactiveMessaging/holidayReminder/holidays';
import { HolidaySheduler } from '../../features/proactiveMessaging/holidayReminder/holidayScheduler';
import { NewIteration } from '../../features/proactiveMessaging/iterationUpdate/newIteration';
import { WeeklyReminder } from '../../features/proactiveMessaging/weeklyReminder/weeklyReminder';
import { continueBotDialog, reactOnCommand } from './utils/reactOnCommand';
import { AnswerDecision } from '../../features/messageAnswering/answerDecision';
import { Command } from './models/command';

export class SkypeBot extends ActivityHandler {
    id: string;
    readonly botState: any;
    readonly holidays: HolidaySheduler;
    readonly answerDecision: AnswerDecision;
    readonly iterationsNotification: NewIteration;
    readonly illnessAnswering: IllnessAnswering;
    readonly congratulator: Сongratulator;
    readonly weeklyReminder: WeeklyReminder;

    constructor(botId: string) {
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
        this.onMessage(async (context: TurnContext, next: () => any) => {
            if (!context.activity.conversation.isGroup) {
                const commands = context.turnState.get('commands');
                if (commands && commands.length) {
                    await this.executeCommands(context, commands);
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
            const membersRemoved = context.activity.membersRemoved || [];
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
            const membersAdded = context.activity.membersAdded || [];
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

    async answerOnRemoteWorkMessage(context: TurnContext) {
        if (context.activity.text) {
            const memberName = context.activity.from.name;
            const botMessage = this.answerDecision
                .answerOnMembersRemoteWork(context.activity.text, memberName);
            if (botMessage) {
                await context.sendActivity(botMessage);
            }
        }
    }

    async answerOnSickLeaveMessage(context: TurnContext) {
        if (context.activity.text) {
            const memberName = context.activity.from.name;
            const botMessage = this.illnessAnswering
                .getAnswerMessage(context.activity.text);
            if (botMessage) {
                await context.sendActivity(botMessage);
            }
        }
    }

    async continueDialog(context: TurnContext) {
        await continueBotDialog(context, this.botState);
    }

    async executeCommands(context: TurnContext, commands: Command[]) {
        const command = commands.find(command => command.name === 'iteration');
        if (command) {
            await reactOnCommand(command, context, this.botState);
        }
    }
}
