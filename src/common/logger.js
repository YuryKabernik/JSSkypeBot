
class Logger {
    constructor(moduleName) {
        this.loggedModuleName = moduleName;
    }

    logInfo(message = '') {
        const prefix = `INFO:[${ this.loggedModuleName }]`;
        return this.writeLog(prefix, message);
    }

    logError(message = '') {
        const prefix = `ERROR:[${ this.loggedModuleName }]`;
        return this.writeLog(prefix, message);
    }

    writeLog(prefix, message) {
        return new Promise(resolve => {
            const dateTimeNow = new Date();
            const timeStamp = dateTimeNow.toLocaleTimeString();
            const dateStamp = dateTimeNow.toLocaleDateString();
            console.error(`${ prefix } --- ${ dateStamp } ${ timeStamp } --- ${ message } \n`);
            resolve();
        });
    }
}

module.exports.Logger = Logger;
