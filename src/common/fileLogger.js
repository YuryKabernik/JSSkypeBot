const { Logger } = require('./logger');
const fs = require('fs');

class FileLogger extends Logger {
    constructor(path, ...args) {
        super(...args);
        this.path = path;
    }

    writeLog(prefix, message) {
        return new Promise(resolve => {
            const dateTimeNow = new Date();
            const timeStamp = dateTimeNow.toLocaleTimeString();
            const dateStamp = dateTimeNow.toLocaleDateString();
            const fullMessage = `${ prefix } --- ${ dateStamp } ${ timeStamp } --- ${ message } \n`;
            fs.appendFileSync(this.path, fullMessage);
            resolve();
        }).finally(() =>
            super.writeLog(prefix, message)
        ).catch(reason => console.error(reason));
    }
}

module.exports.FileLogger = FileLogger;
