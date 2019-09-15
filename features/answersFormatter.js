class AnswersFormatter {
    constructor(initialAnswers) {
        this.answers = initialAnswers;
    }

    lookup(propertyKey) {
        return (propertyKey && typeof propertyKey) === 'string' ? this.answers[propertyKey] : '';
    }

    format(propertyKey, data = {}) {
        if (propertyKey && typeof propertyKey === 'string') {
            let answer = this.answers[propertyKey] || '';
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
