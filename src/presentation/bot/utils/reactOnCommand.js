const { IterationDialog } = require('../dialogs/iterationDialog.js');
const { JokesDialog } = require('../dialogs/jokesDialog.js');
const Injection = require('../../../configuration/registerTypes.js');

const MAIN_ITERATION_WATERFALL_DIALOG = 'MAIN_ITERATION_WATERFALL_DIALOG';
const MAIN_JOKE_WATERFALL_DIALOG = 'MAIN_JOKE_WATERFALL_DIALOG';

/**
 * @param {String} command
 * @param {TurnContext} turnContext
 * @param {BotState} botState
 */
module.exports.reactOnCommand = async function (command, turnContext, botState) {
    switch (command.name) {
        case 'iteration':
            await handleIterationDialog(botState, turnContext);
            break;
        case 'joke':
            await handleJokesDialog(botState, turnContext);
            break;
        default:
            await turnContext.sendActivity(`Sorry, I don't recognize your command :/`);
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

async function handleJokesDialog(botState, turnContext) {
    const jokeDialog = new JokesDialog(
        MAIN_JOKE_WATERFALL_DIALOG,
        botState,
        async (result, state) => await onJokesDialogFinish(state.dialogState, result)
    );
    await jokeDialog.run(turnContext, botState.dialogState); // Run the Dialog with the new message Activity.
    botState.dialogState.lastDialog = jokeDialog;
}

async function handleIterationDialog(botState, turnContext) {
    const iterationDialog = new IterationDialog(
        MAIN_ITERATION_WATERFALL_DIALOG,
        botState,
        async (result, state) => await onIterationDialogFinish(state.dialogState, result)
    );
    await iterationDialog.run(turnContext, botState.dialogState); // Run the Dialog with the new message Activity.
    botState.dialogState.lastDialog = iterationDialog;
}

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

async function onJokesDialogFinish(dialogState) {
    dialogState.lastDialog = null;
}