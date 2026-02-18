/**
 * @file Guid - generates unique guid by provided key.
 */
const { v5: uuidv5 } = require('uuid');

module.exports.guid = function (key) {
    return uuidv5(key, process.env.MICROSOFT_APP_ID);
};
