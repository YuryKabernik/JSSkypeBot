const { Injector } = require('../common/injector.js');
const { Logger } = require('../common/logger.js');
const { SkypeBot } = require('../bot.js');
const { IllnessAnswering } = require('../features/messageAnswering/illnessAnswering.js');
const { Сongratulator } = require('../features/proactiveMessaging/birthdayCongratulation/congratulator.js');
const { AnswerDecision } = require('../features/messageAnswering/answerDecision.js');
const { HolidaySheduler } = require('../features/proactiveMessaging/holidayReminder/holidayScheduler.js');
const { NewIteration } = require('../features/proactiveMessaging/iterationUpdate/newIteration.js');
const { AnswersFormatter } = require('../features/answersFormatter.js');

let injector = null;

function registerTypes() {
    injector = new Injector();

    injector.register('Common.Logger', (...args) => new Logger(...args));
    injector.register('Common.AnswersFormatter', (...args) => new AnswersFormatter(...args));

    injector.register('SkypeBot.TextAnswers', (...args) => new AnswerDecision(...args));
    injector.register('SkypeBot.HolidaySheduler', (...args) => new HolidaySheduler(...args));
    injector.register('SkypeBot.IllnessAnswering', (...args) => new IllnessAnswering(...args));
    injector.register('SkypeBot.Сongratulator', (...args) => new Сongratulator(...args));
    injector.register('SkypeBot.NewIteration', new NewIteration());

    injector.register('Common.SkypeBot', new SkypeBot());

    return getInstance;
};

function getInstance(typeName, ...args) {
    const instance = injector.getInstance(typeName);
    return typeof instance === 'function' ?
        instance(...args) :
        instance;
};

module.exports.registerTypes = registerTypes;
module.exports.getInstance = getInstance;
