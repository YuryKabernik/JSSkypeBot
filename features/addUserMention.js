// https://docs.microsoft.com/en-us/azure/bot-service/bot-service-activities-entities?view=azure-bot-service-4.0&tabs=js
function addUserMention(activity, memberId, memberName) {
    if (!activity.entities) {
        activity.entities = [];
    }
    activity.entities.push(
        {
            type: 'mention',
            mentioned: {
                id: memberId,
                name: memberName
            },
            text: `<at>@${ memberName }</at>`
        }
    );
};

module.exports.addUserMention = addUserMention;
