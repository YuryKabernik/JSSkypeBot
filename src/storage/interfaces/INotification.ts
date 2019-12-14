export interface INotification {
    id: string,
    notification: INotificationContent
}

export interface INotificationContent {
    date: Date,
    message: string,
    creationDate: Date
}