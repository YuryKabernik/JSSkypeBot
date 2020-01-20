const { IterationDialog } = require('../dialogs/iterationDialog.js');
const Injection = require('../../../configuration/registerTypes.js');

const MAIN_ITERATION_WATERFALL_DIALOG = 'MAIN_ITERATION_WATERFALL_DIALOG';

/**
 * @param {String} command
 * @param {TurnContext} turnContext
 * @param {BotState} botState
 */
module.exports.reactOnCommand = async function (command, turnContext, botState) {
    const iterationDialog = new IterationDialog(
        MAIN_ITERATION_WATERFALL_DIALOG,
        botState,
        async (result, state) =>
            await onIterationDialogFinish(state.dialogState, result)
    );

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
        await botState.dialogState.lastDialog.run(
            turnContext, botState.dialogState
        );
    }
};

async function onIterationDialogFinish(dialogState, result) {
    const iterationsRepo = Injection.getInstance('DAL.IterationRepository');
    const iterationsManager = Injection.getInstance('SkypeBot.NewIteration');

    if (result) {
        switch (result.action) {
        case 'DELETE':
            await iterationsRepo.remove(result.iteration.id);
            break;
        case 'EDIT':
            await iterationsRepo.remove(result.previousId);
            await iterationsManager.addIterations([result.iteration]);
            break;
        case 'ADD':
            await iterationsManager.addIterations([result.iteration]);
            break;
        default:
            break;
        }
    }

    dialogState.lastDialog = null;
};
