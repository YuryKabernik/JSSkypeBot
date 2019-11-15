const { IterationDialog } = require('../dialogs/iterationDialog.js');

/**
 * @param {String} command
 * @param {TurnContext} turnContext
 * @param {DialogState} dialogState
 */
async function reactOnCommand(command, turnContext, botState) {
    const iterationDialog = new IterationDialog();

    switch (command.name) {
    case 'iteration':
        // Run the Dialog with the new message Activity.
        await iterationDialog.run(turnContext, botState.dialogState);
        break;
    default:
        break;
    }
}

module.exports.reactOnCommand = reactOnCommand;
