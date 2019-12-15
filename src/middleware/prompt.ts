/**
 * @file Prompt - middleware for parsing and identifying user commands.
 */
import { TurnContext } from "botbuilder";

/* eslint-disable no-useless-escape */
const commandTemplateRegexp = new RegExp(/-\w+/, 'gi');

export  async function promptParser(context: TurnContext, next: Function) {
    if (!context.activity.conversation.isGroup) {
        const isCommandExists = commandTemplateRegexp.test(context.activity.text);
        if (isCommandExists) {
            context.turnState.set('commands', parseCommandInput(context.activity.text));
        }
    }
    await next();
};

function parseCommandInput(inputString = '') {
    const commandsList = inputString.match(commandTemplateRegexp) || [];
    return commandsList.map((command, index) => {
        const commandEndIndex = inputString.search(command) + command.length;
        const nextCommandStartIndex = inputString.search(commandsList[index + 1]) || inputString.length;
        return {
            name: command.replace('-', '').trim(),
            value: inputString.slice(commandEndIndex, nextCommandStartIndex).trim() || null
        };
    });
}
