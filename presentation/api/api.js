const { Notifications } = require('./endpoint/notifications.js');

function getRouts(router) {
    const notificationsController = new Notifications();

    router.mount(
        { method: 'POST', path: '/api/notify/iterations', name: 'NotifyIterations' },
        [(req, res) => notificationsController.iterations(req, res)]
    );
    router.mount(
        { method: 'POST', path: '/api/notify/weekly', name: 'NotifyWeekly' },
        [(req, res) => notificationsController.weekly(req, res)]
    );

    return router;
}

module.exports.apiRoutes = getRouts;
