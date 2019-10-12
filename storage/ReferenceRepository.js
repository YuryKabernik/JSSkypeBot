const Injection = require('../configuration/registerTypes.js');

class ReferenceRepository {
    get all() {
        return Object.values(this.conversationReferences);
    }

    constructor() {
        this.conversationReferences = {};
        this._logger = Injection.getInstance('Common.Logger', 'ReferenceRepository');
        this._dbClient = Injection.getInstance('Services.DbClient', 'ReferenceRepository');
    }

    getById(conversationId) {
        const conversationIdExists = Object.keys(this.conversationReferences).includes(conversationId);
        if (conversationIdExists) {
            return this.conversationReferences[conversationId];
        }
    }

    save(conversationReference) {
        const conversationId = conversationReference.conversation.id;
        const containsConversationId = Object.keys(this.conversationReferences).includes(conversationId);
        if (!containsConversationId) {
            this._logger.logInfo(`New conversation registred: ${ conversationId }`);
            this.conversationReferences[conversationId] = conversationReference;
        } else {
            this._logger.logInfo(`Conversation already registred: ${ conversationId }`);
        }
    }
}

module.exports.ReferenceRepository = ReferenceRepository;
