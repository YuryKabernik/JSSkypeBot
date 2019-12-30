import { Container } from '../common/injector';
import { Logger } from '../common/logger';
import { SkypeBot } from '../presentation/bot/bot';
import { IllnessAnswering } from '../features/messageAnswering/illnessAnswering';
import { Сongratulator } from '../features/proactiveMessaging/birthdayCongratulation/congratulator';
import { AnswerDecision } from '../features/messageAnswering/answerDecision';
import { HolidaySheduler } from '../features/proactiveMessaging/holidayReminder/holidayScheduler';
import { NewIteration } from '../features/proactiveMessaging/iterationUpdate/newIteration';
import { WeeklyReminder } from '../features/proactiveMessaging/weeklyReminder/weeklyReminder';
import { AnswersFormatter } from '../features/answersFormatter';
import { ReferenceRepository } from '../storage/ReferenceRepository';
import { IterationRepository } from '../storage/IterationRepository';
import { NotificationRepository } from '../storage/NotificationRepository';
import { StateManagement } from './dialogStateManagement';
import { DbClient } from '../services/dbClient';
import { dbConnection } from '../configuration/dbConnection';
import { botAdapter } from './botAdapter';
import { MemoryStorage } from 'botbuilder';

let injector!: Container;

export function registerTypes() {
    if (!injector) {
        injector = new Container();

        injector.register('Common.Logger', (moduleName: string) => new Logger(moduleName));
        injector.register('Common.AnswersFormatter', (...args: any[]) => new AnswersFormatter(args[0]));

        injector.register('Services.DbClient', new DbClient(dbConnection()));

        injector.register('DAL.ReferenceRepository', new ReferenceRepository());
        injector.register('DAL.IterationRepository', new IterationRepository());
        injector.register('DAL.NotificationRepository', new NotificationRepository());
        injector.register('DAL.InMemory', new MemoryStorage());

        injector.register('SkypeBot.TextAnswers', (...args: any[]) => new AnswerDecision(args[0]));
        injector.register('SkypeBot.HolidaySheduler', (...args: any[]) => new HolidaySheduler(args[0]));
        injector.register('SkypeBot.IllnessAnswering', (...args: any[]) => new IllnessAnswering());
        injector.register('SkypeBot.Сongratulator', (...args: any[]) => new Сongratulator(args[0]));
        injector.register('SkypeBot.NewIteration', new NewIteration());
        injector.register('SkypeBot.WeeklyReminder', new WeeklyReminder());
        injector.register('SkypeBot.State', new StateManagement());

        injector.register('Bot.SkypeBot', new SkypeBot(''));
        injector.register('Bot.Adapter', botAdapter());
    }
    return (typeName: string, ...args: any[]) => Injection.getInstance(typeName, ...args);
};

export class Injection {
    static getInstance(typeName: string, ...args: any[]) {
        if (injector) {
            const instance = injector.getInstance(typeName);
            return typeof instance === 'function' ?
                instance(...args) :
                instance;
        }
    }
}
