/**
 * @file Guid - generates unique guid by provided key.
 */
const uuid = require('uuid/v5');

module.exports.guid = function (key) {
    return uuid(key, process.env.MicrosoftAppId);
}