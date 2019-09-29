class NotificationRepository {
    get all() {
        return this.notifications;
    }

    constructor() {
        this.notifications = [];
    }

    save(notification) {
        if (notification) {
            this.notifications.push(notification);
        }
    }

    remove(taskId) {
        const indexOfConfiguration = this.notifications.findIndex(notification => notification.taskId === taskId);
        const sheduledCongradulation = this.notifications.find(notification => notification.taskId === taskId);
        if (indexOfConfiguration !== -1) {
            sheduledCongradulation.destroy();
            this.notifications.splice(indexOfConfiguration, 1);
        }
    }
}

module.exports.NotificationRepository = NotificationRepository;
