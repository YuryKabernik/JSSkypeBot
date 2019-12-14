/**
 * @file References - contains stored procedure requests to 'references' table.
 */

import { ConnectionPool } from "mssql";

export function GetReferenceById(connection: ConnectionPool, id: string) {
    const request = connection.request();
    request.input('ConversationId', id);
    return {
        execute: async () => await request
            .execute('GetReferenceById')
    };
};

export function GetAllReferences(connection: ConnectionPool, amount: number = 100) {
    return {
        execute: async () => await connection
            .request()
            .input('amount', amount)
            .execute('GetAllReferences')
    };
};

export function SaveReference(connection: ConnectionPool, reference: any) {
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
