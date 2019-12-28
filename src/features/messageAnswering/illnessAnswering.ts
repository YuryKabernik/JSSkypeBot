import {Injection} from '../../configuration/registerTypes';
import * as keyPhrases from './keyPhrases/gotSickToday.json';
import answers from './textAnswers/answers';
import { AnswersFormatter } from '../answersFormatter';

export class IllnessAnswering {

    readonly answersFormatter: AnswersFormatter;

    constructor() {
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
    }

    getAnswerMessage(message = '') {
        message = message.toLowerCase();
        if (keyPhrases.sickToday.some(keyPhrase => message.includes(keyPhrase))) {
            return this.answersFormatter.lookup('getWellOnSickToday');
        }
        if (keyPhrases.sickLeaveToday.some(keyPhrase => message.includes(keyPhrase))) {
            return this.answersFormatter.lookup('getWellOnSickLeaveToday');
        }
        if (keyPhrases.sickLeaveTomorrow.some(keyPhrase => message.includes(keyPhrase))) {
            return this.answersFormatter.lookup('getWellOnSickLeaveTomorrow');
        }
        if (keyPhrases.halfDaySickLeave.some(keyPhrase => message.includes(keyPhrase))) {
            return this.answersFormatter.lookup('getWellOnHalfDaySickLeave');
        }
        return '';
    }

    isContainsIllnessPhrase(message = '') {
        message = message.toLowerCase();
        const remoteWorkPhrases = [
            ...keyPhrases.sickLeaveTomorrow,
            ...keyPhrases.halfDaySickLeave,
            ...keyPhrases.sickLeaveToday,
            ...keyPhrases.sickToday
        ].map(phrase => phrase.toLowerCase());
        return remoteWorkPhrases.some(keyPhrase => message.includes(keyPhrase));
    }
}

module.exports.IllnessAnswering = IllnessAnswering;
