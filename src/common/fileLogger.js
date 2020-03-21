const { Logger } = require('./logger');
const fs = require('fs');

class FileLogger extends Logger {
    constructor(path, ...args) {
        super(...args);
        this.path = path;
    }

    _writeLog(prefix, message, logLevelCallback = console.error) {
        return new Promise(resolve => {
            const dateTimeNow = new Date();
            const timeStamp = dateTimeNow.toLocaleTimeString();
            const dateStamp = dateTimeNow.toLocaleDateString();
            const fullMessage = `${ prefix } --- ${ dateStamp } ${ timeStamp } --- ${ message } \n`;
            fs.appendFileSync(this.path, fullMessage);
            resolve();
        }).finally(() =>
            super._writeLog(prefix, message, logLevelCallback)
        );
    }
}

module.exports.FileLogger = FileLogger;
