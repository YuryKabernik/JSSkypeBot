const cron = require('node-cron');

class Сongratulator {
    constructor(birthDates, congradulations) {
        this.congradulations = congradulations || [];
        this.birthDates = birthDates || [];
        this.conversationReferences = {};
        this.sheduledCongradulations = [];
    }

    sheduleCongradulation(sendEventCallback) {
        for (const conversationReference of Object.values(this.conversationReferences)) {
            const congradulatinGroupExists =
                conversationReference.conversation.name &&
                conversationReference.conversation.isGroup &&
                this.birthDates[conversationReference.conversation.name];

            if (congradulatinGroupExists) {
                const birthDates = this.birthDates[conversationReference.conversation.name] || [];
                birthDates.forEach(bDate => {
                    const dateExpression = `* * * ${ bDate.date.getDay() } ${ bDate.date.getMonth() }`;
                    const sheduledCongradulation = cron.schedule(dateExpression, () => {
                        sendEventCallback(conversationReference, async turnContext => {
                            await turnContext.sendActivity(`С днём рождения, <at>${ bDate.name }</at>!`);
                        });
                    });
                    const sheduledEventExists = this.sheduledCongradulations.includes(sheduledCongradulation);
                    if (sheduledEventExists) {
                        sheduledCongradulation.destroy();
                    } else {
                        this.sheduledCongradulations.push(sheduledCongradulation);
                    }
                });
            }
        }
    }

    addConversationReference(conversationReference) {
        const conversationId = conversationReference.conversation.id;
        const conversationIds = Object.keys(this.conversationReferences);
        const isProactiveActionNeeded = !!this.birthDates[conversationReference.conversation.name];
        if (isProactiveActionNeeded && !conversationIds.includes(conversationId)) {
            this.conversationReferences[conversationId] = conversationReference;
        }
    }
}

module.exports.Сongratulator = Сongratulator;
