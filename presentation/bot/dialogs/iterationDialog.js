// Import some of the capabities from the module.
const { ChoicePrompt, ConfirmPrompt, ComponentDialog, AttachmentLayoutTypes, DialogSet, DialogTurnStatus, WaterfallDialog, ListStyle } = require('botbuilder-dialogs');

const MAIN_WATERFALL_DIALOG = 'MAIN_ITERATION_WATERFALL_DIALOG';

class IterationDialog extends ComponentDialog {
    constructor() {
        super('IterationDialog');

        // Define the main dialog and its related components.
        this.addDialog(new ChoicePrompt('iterationDateTimeChoice'));
        this.addDialog(new ConfirmPrompt('iterationSaveConfirmPrompt'));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.choiceCardStep.bind(this),
            this.showCardStep.bind(this),
            (stepContext) => {
                stepContext.prompt('iterationDateTimeChoice', {
                    prompt: 'What card would you like to see? You can click or type the card name',
                    retryPrompt: 'That was not a valid choice, please select a card or number from 1 to 9.',
                    choices: [
                        {
                            value: 'Adaptive Card',
                            synonyms: ['adaptive']
                        }
                    ],
                    style: ListStyle.suggestedAction
                });
            }
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

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * 1. Prompts the user if the user is not in the middle of a dialog.
     * 2. Re-prompts the user when an invalid input is received.
     *
     * @param {WaterfallStepContext} stepContext
     */
    async choiceCardStep(stepContext) {
        console.log('MainDialog.choiceCardStep');

        // Create the PromptOptions which contain the prompt and re-prompt messages.
        // PromptOptions also contains the list of choices available to the user.
        const options = {
            prompt: 'What iteration notification would you like to setup? You can click or type the card name.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options or prompt your own date.',
            style: ListStyle.suggestedAction,
            choices: [
                {
                    value: 'Today',
                    action: {
                        type: 'imBack',
                        title: 'Today',
                        value: 'today'
                    },
                    synonyms: ['today']

                },
                {
                    value: 'Tomorrow',
                    action: {
                        type: 'imBack',
                        title: 'Tomorrow',
                        value: 'tomorrow'
                    },
                    synonyms: ['tomorrow']
                }
            ]
        };

        // Prompt the user with the configured PromptOptions.
        return await stepContext.prompt('iterationDateTimeChoice', options);
    }

    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} stepContext
     */
    async showCardStep(stepContext) {
        console.log('MainDialog.showCardStep');

        switch (stepContext.result.value) {
        case 'Adaptive Card':
            await stepContext.context.sendActivity({ attachments: [this.createAdaptiveCard()] });
            break;
        case 'Animation Card':
            await stepContext.context.sendActivity({ attachments: [this.createAnimationCard()] });
            break;
        case 'Audio Card':
            await stepContext.context.sendActivity({ attachments: [this.createAudioCard()] });
            break;
        case 'Hero Card':
            await stepContext.context.sendActivity({ attachments: [this.createHeroCard()] });
            break;
        case 'Receipt Card':
            await stepContext.context.sendActivity({ attachments: [this.createReceiptCard()] });
            break;
        case 'Signin Card':
            await stepContext.context.sendActivity({ attachments: [this.createSignInCard()] });
            break;
        case 'Thumbnail Card':
            await stepContext.context.sendActivity({ attachments: [this.createThumbnailCard()] });
            break;
        case 'Video Card':
            await stepContext.context.sendActivity({ attachments: [this.createVideoCard()] });
            break;
        default:
            await stepContext.context.sendActivity({
                attachments: [
                    this.createAdaptiveCard(),
                    this.createAnimationCard(),
                    this.createAudioCard(),
                    this.createHeroCard(),
                    this.createReceiptCard(),
                    this.createSignInCard(),
                    this.createThumbnailCard(),
                    this.createVideoCard()
                ],
                attachmentLayout: AttachmentLayoutTypes.Carousel
            });
            break;
        }

        // Give the user instructions about what to do next
        await stepContext.context.sendActivity('Type anything to see another card.');

        return await stepContext.endDialog();
    }
}

module.exports.IterationDialog = IterationDialog;
