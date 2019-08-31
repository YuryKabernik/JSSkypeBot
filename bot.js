const { ActivityHandler } = require('botbuilder');

class SkypeBot extends ActivityHandler {
    constructor() {
        super();
        this._assignOnMembersAdded();
        this._assignOnMessageAction();
        this._assignOnMemberRemovedActivity();
    }

    _assignOnMessageAction() {
        this.onMessage(async (context, next) => {
            await context.sendActivity(`${ context.activity.from.name } said '${ context.activity.text }'`); // replace by message parsing.
            await next();
        });
    }

    _assignOnMemberRemovedActivity() {
        this.onMembersRemoved(async (context, next) => {
            if (context.activity.from.name === 'bot' || context.activity.from.name === 'Bot') {
                await context.sendActivity('Никто не знает, какой будет концовка. Чтобы точно знать, что произойдет после смерти, нужно умереть. Хотя у католиков на этот счет есть какие-то надежды. ;(');
            } else {
                await context.sendActivity(`Как жаль, что наши птенчики покидают родительское гнездо ;( \n Прощай, @${ context.activity.from.name } !`);
            }
            await next();
        });
    }

    _assignOnMembersAdded() {
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to the WLN Enhancements Team!');
                }
            }
            await next();
        });
    }
}

module.exports.SkypeBot = SkypeBot;
