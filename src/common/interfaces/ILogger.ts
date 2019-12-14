/**
 * Application logger interaface.
 */
export interface ILogger {
    logInfo(message: string): void;
    logError(message: string): void;
}