const { Messaging } = require('./controller/messaging.js');

function getRouts(router) {
    const messagingController = new Messaging();

    router.mount(
        { method: 'POST', path: '/api/messages', name: 'BotMessages' },
        [(req, res) => messagingController.messages(req, res)]
    );

    return router;
}

module.exports.botRoutes = getRouts;
