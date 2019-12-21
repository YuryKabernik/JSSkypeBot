/**
 * @file Guid - generates unique guid by provided key.
 */
import * as uuid from 'uuid/v5';

export function guid(key: string) {
    return uuid(key, process.env.MicrosoftAppId);
};
