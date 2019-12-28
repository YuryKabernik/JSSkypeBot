import { ConversationState, UserState, StatePropertyAccessor, TurnContext } from "botbuilder";
import { Injection } from '../configuration/registerTypes';

// The accessor names for the conversation data and user profile state property accessors.
const DIALOG_STATE = 'dialogState';
const CONVERSATION_FLOW_PROPERTY = 'confersationFlow';
const USER_PROFILE_PROPERTY = 'userProfile';

export class StateManagement {
    readonly conversationState: ConversationState;
    readonly userState: UserState;
    readonly flowData: StatePropertyAccessor<any>;
    readonly dialogState: StatePropertyAccessor<any>;
    readonly userProfile: StatePropertyAccessor<any>;

    constructor() {
        const memoryStorage = Injection.getInstance('DAL.InMemory');
        this.conversationState = new ConversationState(memoryStorage);
        this.userState = new UserState(memoryStorage);

        this.flowData = this.conversationState.createProperty(CONVERSATION_FLOW_PROPERTY);
        this.dialogState = this.conversationState.createProperty(DIALOG_STATE);
        this.userProfile = this.userState.createProperty(USER_PROFILE_PROPERTY);
    }

    async saveChanges(context: TurnContext) {
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}
