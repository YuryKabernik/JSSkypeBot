/**
 * @file Notifications - contains stored procedure requests to 'notifications' table.
 */

import { INotification } from "../interfaces/INotification";
import { ConnectionPool, NVarChar, Bit } from 'mssql';

export function GetNotificationById(connection: ConnectionPool, id: string) {
    return {
        execute: async () => await connection
            .request()
            .input('notificationId', id)
            .execute('GetWeeklyNotificationById')
    };
};
export function GetAllNotifications(connection: ConnectionPool, amount: number = 100) {
    return {
        execute: async () => await connection
            .request()
            .input('amount', amount)
            .execute('GetAllWeeklyNotifications')
    };
};
export function SaveNotification(connection: ConnectionPool, notification: INotification) {
    return {
        execute: async () => await connection
            .request()
            .input('id', notification.id)
            .input('executionDate', notification.date)
            .input('userMessage', NVarChar, notification.message)
            .input('creationDate', notification.creationDate)
            .execute('SaveWeeklyNotification')
    };
};
export function RemoveNotification(connection: ConnectionPool, id: string) {
    return {
        execute: async () => await connection
            .request()
            .input('notificationId', id)
            .execute('RemoveWeeklyNotification')
    };
};
export function IsNotificationIncluded(connection: ConnectionPool, id: string) {
    return {
        execute: async () => await connection
            .request()
            .input('notificationId', id)
            .output('isIncluded', Bit, 'isIncluded')
            .execute('IsWeeklyNotificationIncluded')
    };
};
