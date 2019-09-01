const { AnswersFormatter } = require('./answersFormatter.js');

class AnswerDecision {
    constructor(botId) {
        this.botId = botId;
    }

    answerOnMembersRemoteWork(message, userName) {
        return AnswersFormatter.format('doNotDenyYourselfAnything', { name: userName });
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
