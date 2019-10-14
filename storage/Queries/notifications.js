const sql = require('mssql');

module.exports.Weekly = {
    GetNotificationById: (connection, id) => {
        return {
            execute: async () => await connection
                .request()
                .input('notificationId', id)
                .execute('GetWeeklyNotificationById')
        };
    },
    GetAllNotifications: (connection, amount = 100) => {
        return {
            execute: async () => await connection
                .request()
                .input('amount', amount)
                .execute('GetAllWeeklyNotifications')
        };
    },
    SaveNotification: (connection, { id, notification }) => {
        return {
            execute: async () => await connection
                .request()
                .input('id', id)
                .input('executionDate', notification.date)
                .input('userMessage', sql.NVarChar, notification.message)
                .input('creationDate', notification.creationDate)
                .execute('SaveWeeklyNotification')
        };
    },
    RemoveNotification: (connection, id) => {
        return {
            execute: async () => await connection
                .request()
                .input('notificationId', id)
                .execute('RemoveWeeklyNotification')
        };
    },
    IsNotificationIncluded: (connection, id) => {
        return {
            execute: async () => await connection
                .request()
                .input('notificationId', id)
                .output('isIncluded', sql.Bit, 'isIncluded')
                .execute('IsWeeklyNotificationIncluded')
        };
    }
};
