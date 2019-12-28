import { ChoicePrompt, ComponentDialog, ConfirmPrompt, DateTimePrompt, NumberPrompt, WaterfallDialog } from 'botbuilder-dialogs';
import { Injection } from '../../../../configuration/registerTypes';
import { options } from './options';
import { editIterationCallback } from './utils/editIterationCallback';

const CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT = 'CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT';
const CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT = 'CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT';
const NUMBER_PROMPT_ITERATION_PATH = 'NUMBER_PROMPT_ITERATION_PATH';
const INPUT_DATE_AND_TIME = 'INPUT_DATE_AND_TIME';
const CONFIRM_CONTINUE_EDITING = 'CONFIRM_CONTINUE_EDITING';

export class EditIterationDialog extends ComponentDialog {
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

        const iterationsRepo = Injection.getInstance('DAL.IterationRepository');
        const allIterations = await iterationsRepo.all();

        if (allIterations && allIterations.length) {
            const stepOptions = options(CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT);

            stepContext.values['avaliableIterations'] = allIterations;
            stepOptions.choices = allIterations.map((iteration) => {
                return {
                    value: iteration.id,
                    action: {
                        title: `Date: ${ iteration.data.date } Path: ${ iteration.data.path }`,
                        value: iteration.id
                    },
                    synonyms: [iteration.id, iteration.data.path]
                };
            });

            return await stepContext.prompt(CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT, stepOptions);
        }
        await stepContext.context.sendActivity(
            'Unfortunately, there are no registered iterations to modify.'
        );
        return await stepContext.endDialog();
    }

    /**
     * Ask user to select a property that will be changed.
     * @param {WaterfallStepContext} stepContext
     */
    async choicePropertyStep(stepContext) {
        console.log('EditIterationDialog.choicePropertyStep');
        const selectedIterationId = stepContext.result.value || '';
        stepContext.values['iterationId'] = selectedIterationId;
        stepContext.values['iterationModified'] = stepContext.values['avaliableIterations']
            .find(iter => iter.id === selectedIterationId);

        const stepOptions = options(CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT);
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

        switch (stepContext.result.value) {
        case 'date':
            promptKey = INPUT_DATE_AND_TIME;
            stepOptions = options(promptKey);
            break;
        case 'path':
            promptKey = NUMBER_PROMPT_ITERATION_PATH;
            stepOptions = options(promptKey);
            break;
        default:
            break;
        }

        stepContext.values['propertyName'] = stepContext.result.value;
        return await stepContext.prompt(promptKey, stepOptions);
    }

    /**
     * Confirm change on selected property.
     * @param {WaterfallStepContext} stepContext
     */
    async confirmChangeStep(stepContext) {
        console.log('EditIterationDialog.confirmChangeStep');

        if (stepContext.values['propertyName']) {
            await editIterationCallback[stepContext.values['propertyName']](
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
        let iteration = null;
        switch (stepContext.result) {
        case true:
            iteration = stepContext.values['iterationModified'];
            await stepContext.context.sendActivity(
                `Iteration notification will be modified. Date: ${ iteration.data.date } Path: ${ iteration.data.path }.`
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
        }

        if (typeof (this.finishCallback) === 'function') {
            await this.finishCallback();
        }
        return await stepContext.endDialog({
            previousId: iteration.id,
            iteration: iteration,
            action: 'EDIT'
        });
    }
}
