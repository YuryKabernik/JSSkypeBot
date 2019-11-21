// Import some of the capabities from the module.
const { ChoicePrompt, ConfirmPrompt, ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const { options } = require('./iterations/options.js');

const MAIN_WATERFALL_DIALOG = 'MAIN_ITERATION_WATERFALL_DIALOG';

class IterationDialog extends ComponentDialog {
    constructor(finishCallback) {
        super('IterationDialog');

        this.finishCallback = finishCallback;

        // Define the main dialog and its related components.
        this.addDialog(new ConfirmPrompt('iterationSaveConfirmPrompt'));
        this.addDialog(new ChoicePrompt('iterationDateTimeChoice'));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.choiceIterationDate.bind(this),
            this.confirmSelectedDate.bind(this),
            this.displaySelectedDate.bind(this)
        ]));

        // The initial child Dialog to run.
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {TurnContext} turnContext
     * @param {DialogState} dialogState
     */
    async run(turnContext, dialogState) {
        const dialogSet = new DialogSet(dialogState);
        dialogSet.add(this);

        this.dialogState = dialogState;

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * Starts dialog conversation with the bot.
     * @param {WaterfallStepContext} stepContext
     */
    async choiceIterationDate(stepContext) {
        console.log('MainDialog.choiceIterationDate');

        const key = 'iterationDateTimeChoice';

        // Prompt the user with the configured PromptOptions.
        return await stepContext.prompt(key, options(key, stepContext));
    }

    /**
     * Confirm or reject selected date and time.
     * @param {WaterfallStepContext} stepContext
     */
    async confirmSelectedDate(stepContext) {
        console.log('MainDialog.confirmSelectedDate');

        const key = 'iterationSaveConfirmPrompt';
        this.dialogState.iterationDate = new Date(stepContext.result.value);

        return await stepContext.prompt(key, options(key, stepContext));
    }

    /**
     * Finishes dialog with saving selected notification date and time.
     * @param {WaterfallStepContext} stepContext
     */
    async displaySelectedDate(stepContext) {
        console.log('MainDialog.displaySelectedDate');

        switch (stepContext.result) {
        case true:
            await stepContext.context.sendActivity(`New Iteration notification will appear on ${ this.dialogState.iterationDate }.`);
            break;
        case false:
            await stepContext.context.sendActivity(`Let me know when you'll decide to schedule a new notification.`);
            break;
        default:
            await stepContext.context.sendActivity('Is that mean Yes?');
            return await this.confirmSelectedDate();
        }
        this.finishCallback(this.dialogState);

        // Give the user instructions about what to do next
        await stepContext.context.sendActivity('Buy! :)');
        return await stepContext.endDialog();
    }
}

module.exports.IterationDialog = IterationDialog;
