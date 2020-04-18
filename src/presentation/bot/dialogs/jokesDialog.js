const { ComponentDialog, ChoicePrompt, ConfirmPrompt, DialogSet,
    DialogTurnStatus, WaterfallDialog, ChoiceFactory } = require('botbuilder-dialogs');
const { options } = require('./jokes/options.js');
const Injection = require('../../../configuration/registerTypes.js');

const CHOICE_PRESENTED_OPTION_JOKE_CATEGORY = 'CHOICE_PRESENTED_OPTION_JOKE_CATEGORY';
const CONFIRM_SHOW_ONE_MORE_JOKE = 'CONFIRM_SHOW_ONE_MORE_JOKE';


class JokesDialog extends ComponentDialog {
    constructor(WATERFALL_DIALOG_ID, botState, finishCallback) {
        super(WATERFALL_DIALOG_ID);
        this._logger = Injection.getInstance('Common.Logger', 'JokesDialog');
        this._jokesService = Injection.getInstance('Services.JokesClient');

        this.botState = botState;
        this.finishCallback = finishCallback;

        // Define the main dialog and its related components.
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG_ID, [
            this.initialStep.bind(this),
            this.showRandomJokeDialogStep.bind(this),
            this.showAnotherJokeConfirmation.bind(this),
            this.finalStep.bind(this)
        ]));

        this.addDialog(new ChoicePrompt(CHOICE_PRESENTED_OPTION_JOKE_CATEGORY));
        this.addDialog(new ConfirmPrompt(CONFIRM_SHOW_ONE_MORE_JOKE));

        // The initial child Dialog to run.
        this.initialDialogId = WATERFALL_DIALOG_ID;
    }

    /**
     * The run method handles the incoming activity
     * (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {TurnContext} turnContext
     * @param {DialogState} dialogState
     */
    async run(turnContext, dialogState) {
        const dialogSet = new DialogSet(dialogState);
        dialogSet.add(this);

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
    async initialStep(stepContext) {
        this._logger.logInfo('JokesDialog - initialStep');
        const stepOptions = options(CHOICE_PRESENTED_OPTION_JOKE_CATEGORY, stepContext);

        const body = await this._jokesService.getCategories();
        stepOptions.choices = ChoiceFactory.toChoices(
            body.categories || body[2].map(cat => cat.name)
        );

        if (!stepOptions.choices || !stepOptions.choices.length) {
            await stepContext.context.sendActivity(`Sorry, I don't remember what categories available :(`);
            await stepContext.context.sendActivity(`Please сontact Yuri Kabernik-Berazouski to help you solve this problem.`);
            return await stepContext.endDialog();
        }

        return await stepContext.prompt(CHOICE_PRESENTED_OPTION_JOKE_CATEGORY, stepOptions);
    }

    /**
     * Show a joke according to selected category option.
     * @param {WaterfallStepContext} stepContext
     */
    async showRandomJokeDialogStep(stepContext) {
        this._logger.logInfo('JokesDialog - showRandomJokeDialogStep');

        const jokeData = await this._jokesService.getJokeByCategory(encodeURIComponent(stepContext.result.value));
        const getRundomIndex = (max) => Math.floor(Math.random() * Math.floor(max));

        await stepContext.context.sendActivity(jokeData.joke || jokeData[getRundomIndex(10)].elementPureHtml);

        return await stepContext.next();
    }

    /**
     * Confirm to show another joke.
     * @param {WaterfallStepContext} stepContext
     */
    async showAnotherJokeConfirmation(stepContext) {
        this._logger.logInfo('JokesDialog - showAnotherJokeConfirmation');

        const stepOptions = options(CONFIRM_SHOW_ONE_MORE_JOKE, stepContext);
        return await stepContext.prompt(CONFIRM_SHOW_ONE_MORE_JOKE, stepOptions);
    }

    /**
     * Starts dialog conversation with the bot.
     * @param {WaterfallStepContext} stepContext
     */
    async finalStep(stepContext) {
        this._logger.logInfo('JokesDialog -- finalStep');

        if (stepContext.result) {
            return await stepContext.replaceDialog(this.initialDialogId);
        }

        await stepContext.context.sendActivity(`The dialogue is over, thanks for participating :)`);
        await stepContext.context.sendActivity(`Let me know if you get bored again ;)`);

        if (typeof (this.finishCallback) === 'function') {
            await this.finishCallback(stepContext.result, this.botState);
        }
        return await stepContext.endDialog();
    }
}

module.exports.JokesDialog = JokesDialog;