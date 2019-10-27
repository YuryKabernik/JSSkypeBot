const { Messaging } = require('./controller/messaging.js');

module.exports.botRoutes = function getRouts(router) {
    const messagingController = new Messaging();

    router.mount(
        { method: 'POST', path: '/api/messages', name: 'BotMessages' },
        [(req, res) => messagingController.messages(req, res)]
    );

    return router;
};
