import { WaterfallStepContext } from "botbuilder-dialogs";

const { ListStyle } = require('botbuilder-dialogs');

export function options(key: string) {
    const options: any = {
        CHOICE_PRESENTED_OPTION_ITERATION_ACTIVITY_TYPE: {
            style: ListStyle.suggestedAction,
            prompt: 'What iteration notification would you like to setup? You can click or type the card name.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options.',
            choices: [
                {
                    value: 'add',
                    action: {
                        type: 'imBack',
                        title: 'Add (checkmark)',
                        value: 'add'
                    },
                    synonyms: ['add']
                },
                {
                    value: 'edit',
                    action: {
                        type: 'imBack',
                        title: 'Edit (memo)',
                        value: 'edit'
                    },
                    synonyms: ['edit']
                },
                {
                    value: 'remove',
                    action: {
                        type: 'imBack',
                        title: 'Remove (crossmark)',
                        value: 'remove'
                    },
                    synonyms: ['remove']
                }
            ]
        },
        CHOICE_PRESENTED_OPTION_ADD_ITERATION: {
            style: ListStyle.suggestedAction,
            prompt: 'What iteration notification date would you like to setup? You can click or type the date.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options or prompt your own date.',
            choices: [
                {
                    value: 'today',
                    action: {
                        type: 'imBack',
                        title: 'Today',
                        value: 'today'
                    },
                    synonyms: ['today']
                },
                {
                    value: 'tomorrow',
                    action: {
                        type: 'imBack',
                        title: 'Tomorrow',
                        value: 'tomorrow'
                    },
                    synonyms: ['tomorrow']
                },
                {
                    value: 'input',
                    action: {
                        type: 'imBack',
                        title: 'Enter custom date',
                        value: 'input'
                    },
                    synonyms: ['input']
                }
            ]
        },
        CHOICE_PRESENTED_OPTION_REMOVE_ITERATION: {
            style: ListStyle.list,
            prompt: 'What iteration notification would you like to Remove? You can click or type the iteration number.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options.',
            choices: [] // Should be submited by user code.
        },
        CHOICE_PRESENTED_OPTION_WHAT_ITERATION_TO_EDIT: {
            style: ListStyle.list,
            prompt: 'What iteration notification would you like to Edit? You can click or type the iteration number.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options.',
            choices: [] // Should be submited by user code.
        },
        CHOICE_PRESENTED_OPTION_WHAT_PROPERTY_TO_EDIT: {
            style: ListStyle.suggestedAction,
            prompt: 'What iteration property would you like to Change? You can click or type the iteration property name.',
            retryPrompt: 'That was not a valid choice, please select one of the provided options.',
            choices: [
                {
                    value: 'date',
                    action: {
                        type: 'imBack',
                        title: 'Change Date and Time',
                        value: 'date'
                    },
                    synonyms: ['date']
                },
                {
                    value: 'path',
                    action: {
                        type: 'imBack',
                        title: 'Change Path',
                        value: 'path'
                    },
                    synonyms: ['path']
                }
            ]
        },
        INPUT_DATE_AND_TIME: {
            prompt: 'Enter the new iteration date please...',
            retryPrompt: 'That was not a valid date, please enter the date in MM.DD.YYYY format.'
        },
        NUMBER_PROMPT_ITERATION_PATH: {
            prompt: 'Enter the new iteration path number please...',
            retryPrompt: 'That was not a valid number, please enter the path in NN.N format'
        },
        CONFIRM_INPUT_ON_REMOVE: {
            style: ListStyle.suggestedAction,
            prompt: 'Should I delete the selected iteration?',
            retryPrompt: 'That was not a valid choice, please select one of the provided options or prompt +/-/yes/no.',
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
        },
        CONFIRM_CONTINUE_EDITING: {
            style: ListStyle.suggestedAction,
            prompt: `Should I modify the selected iteration with the new one?`,
            retryPrompt: 'That was not a valid choice, please select one of the provided options or prompt +/-/yes/no.',
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
        },
        CONFIRM_INPUT_ON_ADD: {
            style: ListStyle.suggestedAction,
            prompt: `Should I save & schedule the entered iteration?`,
            retryPrompt: 'That was not a valid choice, please select one of the provided options or prompt +/-/yes/no.',
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
