/**
 * @file Prompt - middleware for parsing and identifying user commands.
 */
/* eslint-disable no-useless-escape */
const commandTemplateRegexp = /-\w+/gi;

module.exports.promptParser = async (context, next) => {
    if (!context.activity.conversation.isGroup) {
        const isCommandExists = commandTemplateRegexp.test(context.activity.text);
        if (isCommandExists) {
            context.commands = parseCommandInput(context.activity.text);
        }
    }
    await next();
};

function parseCommandInput(inputString = '') {
    const commandsList = inputString.match(commandTemplateRegexp);
    return commandsList.map((command, index) => {
        const commandEndIndex = inputString.search(command) + command.length;
        const nextCommandStartIndex = inputString.search(commandsList[index + 1]) || inputString.length;
        return {
            name: command.replace('-', '').trim(),
            value: inputString.slice(commandEndIndex, nextCommandStartIndex).trim() || null
        };
    });
}
