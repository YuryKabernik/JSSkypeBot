const { AnswersFormatter } = require('../answersFormatter.js');
const keyPhrases = require('./keyPhrases/remoteWorkPhrases.json');
const { answers } = require('./textAnswers/answers.js');

class AnswerDecision {
    constructor(botId) {
        this.botId = botId;
        this.answersFormatter = new AnswersFormatter(answers);
    }

    answerOnMembersRemoteWork(message, userName) {
        message = message.toLowerCase();
        const remoteWorkPhrases = keyPhrases.continueRemoteWork.concat(
            keyPhrases.startRemoteWork,
            keyPhrases.commonRemoteWork
        ).map(phrase => phrase.toLowerCase());
        if (remoteWorkPhrases.some(keyPhrase => message.includes(keyPhrase))) {
            return this.answersFormatter.format('doNotDenyYourselfAnything', { name: userName });
        }
    }

    answerToRemovedMember(removedMemberId, removedMemberName, botId) {
        return removedMemberId !== (this.botId || botId) ?
            this.answersFormatter.format('goodbyeToTheUser', { name: removedMemberName }) :
            this.answersFormatter.lookup('botRemoveLastWords');
    }

    answerToNewMember(newMemberId, botId) {
        return newMemberId !== (this.botId || botId) ?
            `${ this.answersFormatter.lookup('welcomToTheWLNTeam') } ${ this.answersFormatter.lookup('teamIntroduction') }` :
            this.answersFormatter.lookup('botIntroductionSerious');
    }
}

module.exports.AnswerDecision = AnswerDecision;
