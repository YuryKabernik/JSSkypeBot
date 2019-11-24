module.exports.editIterationCallback = {
    date: async function (stepContext) {
        const newDate = new Date(stepContext.result[0].value);
        const previousDate = stepContext.values.iterationModified.date;
        stepContext.values.iterationModified.date = newDate;
        await stepContext.context.sendActivity(
            `Date was changed from ${ previousDate } to ${ newDate }`
        );
    },
    path: async function (stepContext) {
        const newPath = stepContext.result;
        const previousPath = stepContext.values.iterationModified.path;
        stepContext.values.iterationModified.path = newPath;
        await stepContext.context.sendActivity(
            `Path was changed from ${ previousPath } to ${ newPath }`
        );
    }
};
