const { Notifications } = require('./endpoint/notifications.js');
const { Messaging } = require('./endpoint/messaging.js');

module.exports.apiRoutes = function getRouts(router) {
    const notificationsController = new Notifications();
    const messagingController = new Messaging();

    router.mount(
        { method: 'POST', path: '/api/notify/iterations', name: 'NotifyIterations' },
        [(req, res) => notificationsController.iterations(req, res)]
    );
    router.mount(
        { method: 'POST', path: '/api/notify/weekly', name: 'NotifyWeekly' },
        [(req, res) => notificationsController.weekly(req, res)]
    );
    router.mount(
        { method: 'POST', path: '/api/messages', name: 'BotMessages' },
        [(req, res) => messagingController.messages(req, res)]
    );

    return router;
};
