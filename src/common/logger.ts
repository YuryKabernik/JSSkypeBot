import { ILogger } from "./interfaces/ILogger";

/**
 * Logs application errors to console window. 
 */
export class Logger implements ILogger {
    public loggedModuleName: String;

    constructor(moduleName: String) {
        this.loggedModuleName = moduleName;
    }

    logInfo(message = ''): void {
        const prefix = `INFO:[${ this.loggedModuleName }]`;
        const dateTimeNow = new Date();
        const timeStamp = dateTimeNow.toLocaleTimeString();
        const dateStamp = dateTimeNow.toLocaleDateString();
        console.info(`${ prefix } --- ${ dateStamp } ${ timeStamp } --- ${ message } \n`);
    }

    logError(message = ''): void {
        const prefix = `ERROR:[${ this.loggedModuleName }]`;
        const dateTimeNow = new Date();
        const timeStamp = dateTimeNow.toLocaleTimeString();
        const dateStamp = dateTimeNow.toLocaleDateString();
        console.error(`${ prefix } --- ${ dateStamp } ${ timeStamp } --- ${ message } \n`);
    }
}
