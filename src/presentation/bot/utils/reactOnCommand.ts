import { TurnContext, StatePropertyAccessor } from "botbuilder-core";
import { StateManagement } from "../../../configuration/dialogStateManagement";
import { Injection } from '../../../configuration/registerTypes';
import { IterationDialog } from "../dialogs/iterationDialog";
import { Command } from "../models/command";

const MAIN_ITERATION_WATERFALL_DIALOG = 'MAIN_ITERATION_WATERFALL_DIALOG';

/**
 * @param {String} command
 * @param {TurnContext} turnContext
 * @param {BotState} botState
 */
export async function reactOnCommand(command: Command, turnContext: TurnContext, botState: StateManagement) {
    const iterationDialog = new IterationDialog(
        MAIN_ITERATION_WATERFALL_DIALOG,
        async (result: any) =>
            await onIterationDialogFinish(botState.flowData, result, turnContext)
    );

    switch (command.name) {
        case 'iteration':
            // Run the Dialog with the new message Activity.
            await iterationDialog.run(turnContext, botState.flowData);
            await botState.flowData.set(turnContext, { lastDialog: iterationDialog });
            break;
        default:
            const dialogData = await botState.flowData.get(turnContext)
            await dialogData.lastDialog.run();
            break;
    }
};

export async function continueBotDialog(turnContext: TurnContext, botState: StateManagement) {
    const dialogData = await botState.flowData.get(turnContext)
    if (dialogData && dialogData.lastDialog) {
        await dialogData.lastDialog.run(
            turnContext, botState.flowData
        );
    }
};

async function onIterationDialogFinish(flowData: StatePropertyAccessor<any>, result: any, turnContext: TurnContext) {
    const iterationsRepo = Injection.getInstance('DAL.IterationRepository');
    const iterationsManager = Injection.getInstance('SkypeBot.NewIteration');
    flowData.set(turnContext, null);

    switch (result.action) {
        case 'DELETE':
            await iterationsRepo.remove(result.iteration.id);
            break;
        case 'EDIT':
            await iterationsRepo.remove(result.previousId);
            await iterationsManager.addIterations([result.iteration]);
            break;
        case 'ADD':
            await iterationsManager.addIterations([result.iteration]);
            break;
        default:
            break;
    }
};
