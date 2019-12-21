export interface INotification {
    id: string,
    content: INotificationContent
}

export interface INotificationContent {
    date: Date,
    message: string,
    creationDate: string
}