const { ListStyle } = require('botbuilder-dialogs');

module.exports.options = function (key, stepContext) {
    const options = {
        iterationDateTimeChoice: {
            style: ListStyle.suggestedAction,
            prompt: 'What iteration notification would you like to setup? You can click or type the card name.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options or prompt your own date.',
            choices: [
                // {
                //     value: 'add',
                //     action: {
                //         type: 'imBack',
                //         title: 'Add',
                //         value: 'add'
                //     },
                //     synonyms: ['add']
                // },
                // {
                //     value: 'remove',
                //     action: {
                //         type: 'imBack',
                //         title: 'Remove',
                //         value: 'remove'
                //     },
                //     synonyms: ['remove']
                // },
                {
                    value: new Date().toString(),
                    action: {
                        type: 'imBack',
                        title: 'Today',
                        value: new Date().toString()
                    },
                    synonyms: ['today']
                },
                {
                    value: (function () {
                        const today = new Date();
                        today.setDate(today.getDate() + 1);
                        return today.toString();
                    })(),
                    action: {
                        type: 'imBack',
                        title: 'Tomorrow',
                        value: (function () {
                            const today = new Date();
                            today.setDate(today.getDate() + 1);
                            return today.toString();
                        })()
                    },
                    synonyms: ['tomorrow']
                }
            ]
        },
        iterationSaveConfirmPrompt: {
            style: ListStyle.suggestedAction,
            prompt: `Should I proceed with the date ${ stepContext.result && stepContext.result.value }`,
            retryPrompt: 'That was not a valid choice, please select one of the provided options or prompt +/-/yes/no.',
            choices: [
                {
                    value: 'yes',
                    action: {
                        type: 'imBack',
                        title: 'Yes',
                        value: 'yes'
                    },
                    synonyms: ['yes', '+']
                },
                {
                    value: 'no',
                    action: {
                        type: 'imBack',
                        title: 'No',
                        value: 'no'
                    },
                    synonyms: ['no', '-']
                }
            ]
        }
    };

    return options[key];
};
