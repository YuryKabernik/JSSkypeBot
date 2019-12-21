import { WaterfallStepContext } from "botbuilder-dialogs";
import { IIterationInfo } from "../../../../storage/interfaces/IIteration";

const { options } = require('./options.js');
const { TextPrompt, ChoicePrompt, ConfirmPrompt, ComponentDialog, DateTimePrompt, WaterfallDialog } = require('botbuilder-dialogs');

const CHOICE_PRESENTED_OPTION = 'CHOICE_PRESENTED_OPTION_ADD_ITERATION';
const NUMBER_PROMPT_ITERATION_PATH = 'NUMBER_PROMPT_ITERATION_PATH';
const INPUT_DATE_AND_TIME = 'INPUT_DATE_AND_TIME';
const CONFIRM_INPUT_ON_ADD = 'CONFIRM_INPUT_ON_ADD';

export class AddIterationDialog extends ComponentDialog {
    constructor(ADD_ITERATION_WATERFALL_DIALOG: string, finishCallback?: Function) {
        super(ADD_ITERATION_WATERFALL_DIALOG);

        this.finishCallback = finishCallback;

        // Define the main dialog and its related components.
        this.addDialog(new WaterfallDialog(ADD_ITERATION_WATERFALL_DIALOG, [
            this.enterPathStep.bind(this),
            this.choiceDateStep.bind(this),
            this.branchingChoiceStep.bind(this),
            this.collectSelectedDateStep.bind(this),
            this.confirmInputStep.bind(this)
        ]));

        this.addDialog(new TextPrompt(NUMBER_PROMPT_ITERATION_PATH));
        this.addDialog(new ChoicePrompt(CHOICE_PRESENTED_OPTION));
        this.addDialog(new DateTimePrompt(INPUT_DATE_AND_TIME));
        this.addDialog(new ConfirmPrompt(CONFIRM_INPUT_ON_ADD));

        // The initial child Dialog to run.
        this.initialDialogId = ADD_ITERATION_WATERFALL_DIALOG;
    }

    /**
     * Starts dialog conversation with the bot.
     * Prompt the user with the iteration path text value.
     * @param {WaterfallStepContext} stepContext
     */
    async enterPathStep(stepContext: WaterfallStepContext) {
        console.log('AddIterationDialog.enterPathStep');
        stepContext.values['iteration'] = {};
        const stepOptions = options(NUMBER_PROMPT_ITERATION_PATH, stepContext);
        return await stepContext.prompt(NUMBER_PROMPT_ITERATION_PATH, stepOptions);
    }

    /**
     * Prompt the user with the configured date choice.
     * @param {WaterfallStepContext} stepContext
     */
    async choiceDateStep(stepContext: WaterfallStepContext) {
        console.log('AddIterationDialog.choiceDateStep');
        stepContext.values['iteration'].path = stepContext.result || '';
        const stepOptions = options(CHOICE_PRESENTED_OPTION, stepContext);
        return await stepContext.prompt(CHOICE_PRESENTED_OPTION, stepOptions);
    }

    /**
     * Branching dialog user answer to accept selected date
     * or process with user input date.
     * @param {WaterfallStepContext} stepContext
     */
    async branchingChoiceStep(stepContext: WaterfallStepContext) {
        console.log('AddIterationDialog.branchingChoiceStep');
        const selectedDate = new Date();
        selectedDate.setHours(9, 0, 0);

        switch (stepContext.result.value) {
        case 'today':
            break;
        case 'tomorrow':
            selectedDate.setDate(selectedDate.getDate() + 1);
            break;
        case 'input':
            const stepOptions = options(INPUT_DATE_AND_TIME, stepContext);
            return await stepContext.prompt(INPUT_DATE_AND_TIME, stepOptions);
        default:
            return await stepContext.replaceDialog(this.id);
        }

        if (typeof (this.finishCallback) === 'function') {
            await this.finishCallback();
        }
        stepContext.values['iteration'].date = selectedDate;
        return await stepContext.next(null);
    }

    /**
     * Collect user input about entered date.
     * @param {WaterfallStepContext} stepContext
     */
    async collectSelectedDateStep(stepContext: WaterfallStepContext) {
        console.log('AddIterationDialog.collectSelectedDateStep');
        const iteration = stepContext.values['iteration'] as IIterationInfo;
        if (stepContext.result && stepContext.result[0]) {
            iteration.date = new Date(stepContext.result[0].value);
        }
        const stepOptions = options(CONFIRM_INPUT_ON_ADD, stepContext);
        return await stepContext.prompt(CONFIRM_INPUT_ON_ADD, stepOptions);
    }

    /**
     * Confirm new iteration input.
     * @param {WaterfallStepContext} stepContext
     */
    async confirmInputStep(stepContext: WaterfallStepContext) {
        console.log('AddIterationDialog.confirmInputStep');
        let iteration = null;
        switch (stepContext.result) {
        case true:
            iteration = stepContext.values['iteration'] as IIterationInfo;
            await stepContext.context.sendActivity(
                `Iteration notification will be Added. Date: ${ iteration.date } Path: ${ iteration.path }.`
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
            iteration: iteration,
            action: 'ADD'
        });
    }
}
