const { ChoicePrompt, ConfirmPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const Injection = require('../../../../configuration/registerTypes.js');
const { options } = require('./options.js');

const CHOICE_PRESENTED_OPTION = 'CHOICE_PRESENTED_OPTION_REMOVE_ITERATION';
const CONFIRM_INPUT = 'CONFIRM_INPUT_ON_REMOVE';

class RemoveIterationDialog extends ComponentDialog {
    constructor(REMOVE_ITERATION_WATERFALL_DIALOG, finishCallback) {
        super(REMOVE_ITERATION_WATERFALL_DIALOG);

        this.finishCallback = finishCallback;

        // Define the main dialog and its related components.
        this.addDialog(new WaterfallDialog(REMOVE_ITERATION_WATERFALL_DIALOG, [
            this.choiceIterationFromListStep.bind(this),
            this.confirmSelectionStep.bind(this),
            this.finishStep.bind(this)
        ]));

        this.addDialog(new ChoicePrompt(CHOICE_PRESENTED_OPTION));
        this.addDialog(new ConfirmPrompt(CONFIRM_INPUT));

        // The initial child Dialog to run.
        this.initialDialogId = REMOVE_ITERATION_WATERFALL_DIALOG;
    }

    /**
     * Starts dialog of iteration deletion.
     * Ask user to select an iteration to proceed.
     * @param {WaterfallStepContext} stepContext
     */
    async choiceIterationFromListStep(stepContext) {
        console.log('RemoveIterationDialog.choiceIterationFromListStep');
        const stepOptions = options(CHOICE_PRESENTED_OPTION, stepContext);

        const iterationsRepo = Injection.getInstance('DAL.IterationRepository');
        const allIteration = await iterationsRepo.all();

        stepOptions.choices = allIteration.map((iteration, index) => {
            return {
                value: iteration,
                action: {
                    type: 'imBack',
                    title: `Date: ${ iteration.date } Path: ${ iteration.path }`,
                    value: iteration
                },
                synonyms: [index, iteration.id, iteration.path]
            };
        });

        return await stepContext.prompt(CHOICE_PRESENTED_OPTION, stepOptions);
    }

    /**
     *
     * @param {WaterfallStepContext} stepContext
     */
    async confirmSelectionStep(stepContext) {
        console.log('RemoveIterationDialog.confirmSelectedDate');

        const iteration = stepContext.result.value || {};
        const stepOptions = options(CONFIRM_INPUT, stepContext);

        stepOptions.prompt = `Should I remove iteration of Date: ${ iteration.date } Path: ${ iteration.path } ?`;
        stepContext.values.iteration = stepContext.result.value;

        return await stepContext.prompt(CONFIRM_INPUT, stepOptions);
    }

    /**
     *
     * @param {WaterfallStepContext} stepContext
     */
    async finishStep(stepContext) {
        console.log('RemoveIterationDialog.finishStep');

        switch (stepContext.result) {
        case true:
            const iteration = stepContext.values.iteration;
            await stepContext.context.sendActivity(
                `Iteration notification will be removed. Date: ${ iteration.date } Path: ${ iteration.path }.`
            );
            break;
        case false:
            return await stepContext.endDialog();
        default:
            await stepContext.context.sendActivity('Is that mean Yes?');
            return await this.repromptDialog();
        }

        if (typeof (this.finishCallback) === 'function') {
            await this.finishCallback();
        }
        return await stepContext.endDialog({
            iteration: stepContext.values.iteration,
            action: 'DELETE'
        });
    }
}

module.exports.RemoveIterationDialog = RemoveIterationDialog;
