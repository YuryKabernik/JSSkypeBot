const sql = require('mssql');

module.exports.GetReferenceById = function GetReferenceById(connection, id) {
    const request = new sql.Request(connection);
    request.input('ConversationId', id);
    return {
        execute: async () => await request
            .execute('GetReferenceById')
    };
};

module.exports.GetAllReferences = function GetAllReferences(connection, amount = 100) {
    return {
        execute: async () => await connection
            .request()
            .input('amount', amount)
            .execute('GetAllReferences')
    };
};

module.exports.SaveReference = function SaveReference(connection, reference) {
    return {
        execute: async () => await connection
            .request()
            .input('ConversationId', reference.conversation.id)
            .input('TenantId', reference.conversation.tenantId || '')
            .input('ConversationObject', JSON.stringify(reference))
            .input('IsGroup', reference.conversation.isGroup || false)
            .execute('SaveReference')
    };
};
