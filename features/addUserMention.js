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
