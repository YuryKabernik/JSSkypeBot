const { ListStyle } = require('botbuilder-dialogs');

module.exports.options = function (key, stepContext) {
    const options = {
        CHOICE_PRESENTED_OPTION_JOKE_CATEGORY: {
            style: ListStyle.suggestedAction,
            prompt: 'What kind of joke would you like to get? You can click or type the category name.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options.',
            choices: []
        },
        CONFIRM_SHOW_ONE_MORE_JOKE: {
            style: ListStyle.suggestedAction,
            prompt: `Should I show you another joke?`,
            retryPrompt: 'That was not a valid choice, please select one of the provided options.',
            choices: [
                {
                    value: 'yes',
                    action: {
                        type: 'imBack',
                        title: 'Yes',
                        value: 'yes'
                    },
                    synonyms: ['yes', 'y', '+']
                },
                {
                    value: 'no',
                    action: {
                        type: 'imBack',
                        title: 'No',
                        value: 'no'
                    },
                    synonyms: ['no', 'n', '-']
                }
            ]
        }
    };

    return options[key];
};
