import { Activity, Mention } from "botbuilder";

// https://docs.microsoft.com/en-us/azure/bot-service/bot-service-activities-entities?view=azure-bot-service-4.0&tabs=js
export function addUserMention(activity: Activity, memberId: string, memberName: string) {
    if (!activity.entities) {
        activity.entities = [];
    }
    const metionData: Mention = {
        type: 'mention',
        mentioned: {
            id: memberId,
            name: memberName
        },
        text: `<at>@${ memberName }</at>`
    };    
    activity.entities.push(metionData);
};
