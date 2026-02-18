const { Notifications } = require('./endpoint/notifications.js');
const { Messaging } = require('./endpoint/messaging.js');

module.exports.apiRoutes = function getRouts(router) {
    const notificationsController = new Notifications();
    const messagingController = new Messaging();

    router.mount(
        { method: 'POST', path: '/api/notify/iterations', name: 'NotifyIterations' },
        [async (req, res) => await notificationsController.iterations(req, res)]
    );
    router.mount(
        { method: 'POST', path: '/api/notify/weekly', name: 'NotifyWeekly' },
        [async (req, res) => await notificationsController.weekly(req, res)]
    );
    router.mount(
        { method: 'POST', path: '/api/messages', name: 'BotMessages' },
        [async (req, res) => await messagingController.messages(req, res)]
    );

    return router;
};
