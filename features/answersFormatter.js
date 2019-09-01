const { answers } = require('../answers/answers.js');

const AnswersFormatter = {
    lookup: function(propertyKey) {
        return (propertyKey && typeof propertyKey) === 'string' ? answers[propertyKey] : '';
    },
    format: function(propertyKey, data = {}) {
        if (propertyKey && typeof propertyKey === 'string') {
            let answer = answers[propertyKey] || '';
            const propNames = Object.getOwnPropertyNames(data);
            propNames.forEach(name => {
                const whatToReplace = `{${ name }}`;
                const replaceValue = data[name];
                if (answer.includes(whatToReplace)) {
                    answer = answer.replace(whatToReplace, replaceValue);
                }
            });
            return answer;
        }
        return '';
    }
};

module.exports.AnswersFormatter = AnswersFormatter;
