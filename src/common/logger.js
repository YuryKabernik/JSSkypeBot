class Logger {
    constructor(moduleName) {
        this.loggedModuleName = moduleName;
    }

    logInfo(message = '') {
        const prefix = `INFO:[${this.loggedModuleName}]`;
        return this._writeLog(prefix, message, console.info).catch(console.error);
    }

    logError(message = '') {
        const prefix = `ERROR:[${this.loggedModuleName}]`;
        return this._writeLog(prefix, message, console.error).catch(console.error);
    }

    _writeLog(prefix, message, logLevelCallback = console.error) {
        return new Promise(resolve => {
            const dateTimeNow = new Date();
            const timeStamp = dateTimeNow.toLocaleTimeString();
            const dateStamp = dateTimeNow.toLocaleDateString();
            if (logLevelCallback) {
                logLevelCallback(`${prefix} --- ${dateStamp} ${timeStamp} --- ${message} \n`);
            }
            resolve();
        });
    }
}

module.exports.Logger = Logger;
