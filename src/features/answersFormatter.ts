/**
 * Returns a simple of formated text by provided key.
 */
export class AnswersFormatter {
    readonly answers: any;

    constructor(...initialAnswers: string[]) {
        this.answers = initialAnswers;
    }

    /**
     * Returns simple string by key.
     * @param {*} propertyKey 
     */
    lookup(propertyKey: string) {
        return (propertyKey && typeof propertyKey) === 'string' ? this.answers[propertyKey] : '';
    }

    /**
    * Returns formatted string with inserted values into strings by key.
    */
    format(propertyKey: string, data: any = {}) {
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
