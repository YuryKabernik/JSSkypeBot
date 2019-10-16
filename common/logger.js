
class Logger {
    constructor(moduleName) {
        this.loggedModuleName = moduleName;
    }

    logInfo(message = '') {
        const prefix = `INFO:[${ this.loggedModuleName }]`;
        const dateTimeNow = new Date();
        const timeStamp = dateTimeNow.toLocaleTimeString();
        const dateStamp = dateTimeNow.toLocaleDateString();
        console.info(`${ prefix } --- ${ dateStamp } ${ timeStamp } --- ${ message } \n`);
    }

    logError(message = '') {
        const prefix = `ERROR:[${ this.loggedModuleName }]`;
        const dateTimeNow = new Date();
        const timeStamp = dateTimeNow.toLocaleTimeString();
        const dateStamp = dateTimeNow.toLocaleDateString();
        console.error(`${ prefix } --- ${ dateStamp } ${ timeStamp } --- ${ message } \n`);
    }
}

module.exports.Logger = Logger;
