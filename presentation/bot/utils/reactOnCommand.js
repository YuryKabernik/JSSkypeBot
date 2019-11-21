const { IterationDialog } = require('../dialogs/iterationDialog.js');

/**
 * @param {String} command
 * @param {TurnContext} turnContext
 * @param {BotState} botState
 */
module.exports.reactOnCommand = async function (command, turnContext, botState) {
    const onDialogFinish = (dialogState) => {
        dialogState.lastDialog = null;
    };
    const iterationDialog = new IterationDialog(onDialogFinish);

    switch (command.name) {
    case 'iteration':
        // Run the Dialog with the new message Activity.
        await iterationDialog.run(turnContext, botState.dialogState);
        botState.dialogState.lastDialog = iterationDialog;
        break;
    default:
        await botState.dialogState.lastDialog.run();
        break;
    }
};

module.exports.continueBotDialog = async function (turnContext, botState) {
    if (botState.dialogState.lastDialog) {
        await botState.dialogState.lastDialog.run(turnContext, botState.dialogState);
    }
};
