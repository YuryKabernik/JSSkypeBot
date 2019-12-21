import { WaterfallStepContext } from "botbuilder-dialogs";
import { IterationModified } from '../values/iterationModified'

export const editIterationCallback: {} = {
    date: async function (stepContext: WaterfallStepContext) {
        const iteration = (stepContext.values as IterationModified);
        const previousDate = iteration.date;
        iteration.date = new Date(stepContext.result[0].value);
        await stepContext.context.sendActivity(
            `Date was changed from ${previousDate} to ${iteration.date}`
        );
    },
    path: async function (stepContext: WaterfallStepContext) {
        const iteration = (stepContext.values as IterationModified);
        const previousPath: string = iteration.path;
        iteration.path = stepContext.result;
        await stepContext.context.sendActivity(
            `Path was changed from ${previousPath} to ${iteration.path}`
        );
    }
};
