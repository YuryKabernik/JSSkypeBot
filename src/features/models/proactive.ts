/**
 * @file Contains proactive messaging features interfaces.
 */
import * as cron from 'node-cron';

export interface ScheduledTask {
    id: string;
    cronTask: cron.ScheduledTask
}

export interface Holiday {
    name: string;
    date: Date;
    selebration: string;
}

export interface Birthday {
    name: string;
    date: string;
}
