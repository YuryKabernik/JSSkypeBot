const { ChoicePrompt, ConfirmPrompt, ComponentDialog, DateTimePrompt, NumberPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const Injection = require('../../../../configuration/registerTypes.js');
const { options } = require('./options.js');

const CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT = 'CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT';
const CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT = 'CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT';
const NUMBER_PROMPT_ITERATION_PATH = 'NUMBER_PROMPT_ITERATION_PATH';
const INPUT_DATE_AND_TIME = 'INPUT_DATE_AND_TIME';
const CONFIRM_CONTINUE_EDITING = 'CONFIRM_CONTINUE_EDITING';

class EditIterationDialog extends ComponentDialog {
    constructor(EDIT_ITERATION_WATERFALL_DIALOG, finishCallback) {
        super(EDIT_ITERATION_WATERFALL_DIALOG);

        this.finishCallback = finishCallback;

        // Define the main dialog and its related components.
        this.addDialog(new WaterfallDialog(EDIT_ITERATION_WATERFALL_DIALOG, [
            this.choiceIterationFromListStep.bind(this),
            this.choicePropertyStep.bind(this),
            this.editPropertyStep.bind(this),
            this.confirmChangeStep.bind(this),
            this.finishStep.bind(this)
        ]));

        this.addDialog(new ChoicePrompt(CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT));
        this.addDialog(new ChoicePrompt(CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT_ITERATION_PATH));
        this.addDialog(new DateTimePrompt(INPUT_DATE_AND_TIME));
        this.addDialog(new ConfirmPrompt(CONFIRM_CONTINUE_EDITING));

        // The initial child Dialog to run.
        this.initialDialogId = EDIT_ITERATION_WATERFALL_DIALOG;
    }

    /**
     * Starts dialog of iteration edition.
     * Ask user to select an iteration to proceed.
     * @param {WaterfallStepContext} stepContext
     */
    async choiceIterationFromListStep(stepContext) {
        console.log('EditIterationDialog.choiceIterationFromListStep');
        const stepOptions = options(CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT, stepContext);

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

        return await stepContext.prompt(CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT, stepOptions);
    }

    /**
     * Ask user to select a property that will be canged.
     * @param {WaterfallStepContext} stepContext
     */
    async choicePropertyStep(stepContext) {
        console.log('EditIterationDialog.choicePropertyStep');
        stepContext.values.iterationId =
            (stepContext.result.value && stepContext.result.value.id) || '';
        stepContext.values.iterationModified = stepContext.result.value || {};
        const stepOptions = options(
            CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT,
            stepContext
        );
        return await stepContext.prompt(
            CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT,
            stepOptions
        );
    }

    /**
     * Branch on iteration property selection.
     * @param {WaterfallStepContext} stepContext
     */
    async editPropertyStep(stepContext) {
        console.log('EditIterationDialog.editPropertyStep');
        let promptKey = '';
        let stepOptions = {};
        let updateIterationCallback = null;

        switch (stepContext.result.value) {
        case 'date':
            promptKey = INPUT_DATE_AND_TIME;
            stepOptions = options(promptKey, stepContext);
            updateIterationCallback = (value, stepContext) => {
                const previousDate = stepContext.values.iterationModified.date;
                stepContext.values.iterationModified.date =
                    new Date(value).toString();
                stepContext.context.sendActivity(
                    `Date was changed from ${ previousDate } to ${ value }`
                );
            };
            break;
        case 'path':
            promptKey = NUMBER_PROMPT_ITERATION_PATH;
            stepOptions = options(promptKey, stepContext);
            updateIterationCallback = (value, stepContext) => {
                const previousPath = stepContext.values.iterationModified.path;
                stepContext.values.iterationModified.path = value;
                stepContext.context.sendActivity(
                    `Path was changed from ${ previousPath } to ${ value }`
                );
            };
            break;
        default:
            return await stepContext.repromptDialog();
        }

        stepContext.values.updateIterationCallback = updateIterationCallback;
        return await stepContext.prompt(promptKey, stepOptions);
    }

    /**
     * Confirm change on selected property.
     * @param {WaterfallStepContext} stepContext
     */
    async confirmChangeStep(stepContext) {
        console.log('EditIterationDialog.confirmChangeStep');

        if (stepContext.values.updateIterationCallback) {
            stepContext.values.updateIterationCallback(
                stepContext.result,
                stepContext
            );
        }

        const stepOptions = options(CONFIRM_CONTINUE_EDITING, stepContext);
        return await stepContext.prompt(CONFIRM_CONTINUE_EDITING, stepOptions);
    }

    /**
     * Finish modification process.
     * @param {WaterfallStepContext} stepContext
     */
    async finishStep(stepContext) {
        console.log('EditIterationDialog.finishStep');

        switch (stepContext.result) {
        case true:
            const iteration = stepContext.values.iterationModified;
            await stepContext.context.sendActivity(
                `Iteration notification will be modified. Date: ${ iteration.date } Path: ${ iteration.path }.`
            );
            break;
        case false:
            await stepContext.context.sendActivity(
                `Modification process stopped.`
            );
            if (typeof (this.finishCallback) === 'function') {
                await this.finishCallback();
            }
            return await stepContext.endDialog();
        default:
            await stepContext.context.sendActivity('Is that mean Yes?');
            return await this.repromptDialog();
        }

        if (typeof (this.finishCallback) === 'function') {
            await this.finishCallback();
        }
        return await stepContext.endDialog({
            previousId: stepContext.values.iterationId,
            iteration: stepContext.values.iterationModified,
            action: 'EDIT'
        });
    }
}

module.exports.EditIterationDialog = EditIterationDialog;
