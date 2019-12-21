import { ChoicePrompt, ComponentDialog, ConfirmPrompt, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { Injection } from '../../../../configuration/registerTypes';
import { options } from './options';
import { IIteration } from "../../../../storage/interfaces/IIteration";

const CHOICE_PRESENTED_OPTION = 'CHOICE_PRESENTED_OPTION_REMOVE_ITERATION';
const CONFIRM_INPUT = 'CONFIRM_INPUT_ON_REMOVE';

export class RemoveIterationDialog extends ComponentDialog {

    finishCallback?: Function;

    constructor(REMOVE_ITERATION_WATERFALL_DIALOG: string, finishCallback?: Function) {
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
    async choiceIterationFromListStep(stepContext: WaterfallStepContext) {
        console.log('RemoveIterationDialog.choiceIterationFromListStep');

        const iterationsRepo = Injection.getInstance('DAL.IterationRepository');
        const allIteration: IIteration[] = await iterationsRepo.all();

        if (allIteration && allIteration.length) {
            const stepOptions = options(CHOICE_PRESENTED_OPTION);

            stepContext.values['avaliableIterations'] = allIteration;
            stepOptions.choices = allIteration.map((iteration) => {
                return {
                    value: iteration.id,
                    action: {
                        type: 'imBack',
                        title: `Date: ${iteration.data.date} Path: ${iteration.data.path}`,
                        value: iteration.id
                    },
                    synonyms: [iteration.id, iteration.data.path]
                };
            });

            return await stepContext.prompt(CHOICE_PRESENTED_OPTION, stepOptions);
        }
        await stepContext.context.sendActivity(
            'Unfortunately there are no registered iterations to delete.'
        );
        return await stepContext.endDialog();
    }

    /**
     *
     * @param {WaterfallStepContext} stepContext
     */
    async confirmSelectionStep(stepContext: WaterfallStepContext) {
        console.log('RemoveIterationDialog.confirmSelectedDate');

        const selectedIterationId = stepContext.result.value || '';
        const selectedIteration = (stepContext.values['avaliableIterations'] as IIteration[])
            .find(iter => iter.id === selectedIterationId);

        const stepOptions = options(CONFIRM_INPUT);
        stepOptions.prompt = `Should I remove iteration of Date: ${selectedIteration?.data.date} Path: ${selectedIteration?.data.path} ?`;
        stepContext.values['iteration'] = selectedIteration;

        return await stepContext.prompt(CONFIRM_INPUT, stepOptions);
    }

    /**
     *
     * @param {WaterfallStepContext} stepContext
     */
    async finishStep(stepContext: WaterfallStepContext) {
        console.log('RemoveIterationDialog.finishStep');

        switch (stepContext.result) {
            case true:
                const iteration = stepContext.values['iteration'] as IIteration;
                await stepContext.context.sendActivity(
                    `Iteration notification will be removed. Date: ${iteration.data.date} Path: ${iteration.data.path}.`
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
            iteration: stepContext.values['iteration'],
            action: 'DELETE'
        });
    }
}
