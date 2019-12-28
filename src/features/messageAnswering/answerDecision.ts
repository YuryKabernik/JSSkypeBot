import { AnswersFormatter } from "../answersFormatter";
import {Injection} from '../../configuration/registerTypes';
import * as keyPhrases from './keyPhrases/remoteWorkPhrases.json';
import answers from './textAnswers/answers';

export class AnswerDecision {
    
    botId: string;
    answersFormatter: AnswersFormatter;
    
    constructor(botId: string) {
        this.botId = botId;
        this.answersFormatter = Injection.getInstance('Common.AnswersFormatter', answers);
    }

    answerOnMembersRemoteWork(message: string, userName: string) {
        message = message.toLowerCase();
        const remoteWorkPhrases = keyPhrases.continueRemoteWork.concat(
            keyPhrases.startRemoteWork,
            keyPhrases.commonRemoteWork
        ).map(phrase => phrase.toLowerCase());
        if (remoteWorkPhrases.some(keyPhrase => message.includes(keyPhrase))) {
            return this.answersFormatter.format('doNotDenyYourselfAnything', { name: userName });
        }
    }

    answerToRemovedMember(removedMemberId: string, removedMemberName: string, botId: string) {
        return removedMemberId !== (this.botId || botId) ?
            this.answersFormatter.format('goodbyeToTheUser', { name: removedMemberName }) :
            this.answersFormatter.lookup('botRemoveLastWords');
    }

    answerToNewMember(newMemberId: string, botId: string) {
        return newMemberId !== (this.botId || botId) ?
            `${ this.answersFormatter.lookup('welcomToTheWLNTeam') } ${ this.answersFormatter.lookup('teamIntroduction') }` :
            this.answersFormatter.lookup('botIntroductionSerious');
    }
}
