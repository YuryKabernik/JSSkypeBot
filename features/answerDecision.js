const { AnswersFormatter } = require('./answersFormatter.js');
const keyPhrases = require('../keyPhrases/remoteWorkPhrases.json');

class AnswerDecision {
    constructor(botId) {
        this.botId = botId;
    }

    answerOnMembersRemoteWork(message, userName) {
        const remoteWorkPhrases = keyPhrases.continueRemoteWork.concat(
            keyPhrases.startRemoteWork,
            keyPhrases.commonRemoteWork
        );
        if (remoteWorkPhrases.some(keyPhrase => message.includes(keyPhrase))) {
            return AnswersFormatter.format('doNotDenyYourselfAnything', { name: userName });
        }
    }

    answerToRemovedMember(removedMemberId, removedMemberName, botId) {
        return removedMemberId !== (this.botId || botId) ?
            AnswersFormatter.format('goodbyeToTheUser', { name: removedMemberName }) :
            AnswersFormatter.lookup('botRemoveLastWords');
    }

    answerToNewMember(newMemberId, botId) {
        return newMemberId !== (this.botId || botId) ?
            `${ AnswersFormatter.lookup('welcomToTheWLNTeam') } ${ AnswersFormatter.lookup('teamIntroduction') }` :
            AnswersFormatter.lookup('botIntroductionSerious');
    }
}

module.exports.AnswerDecision = AnswerDecision;
