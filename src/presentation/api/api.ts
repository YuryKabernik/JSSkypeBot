import { Notifications } from './endpoint/notifications';
import { Messaging } from './endpoint/messaging';
import { Router, MountOptions } from 'restify';

export function apiRoutes(router: Router) {
    const notificationsController = new Notifications();
    const messagingController = new Messaging();
    
    const NotifyIterationsOptions: MountOptions = { method: 'POST', path: '/api/notify/iterations', name: 'NotifyIterations', contentType: 'json' };
    router.mount(
        NotifyIterationsOptions,
        (req, res) => notificationsController.iterations(req, res)
    );
    
    const NotifyWeeklyOptions: MountOptions = { method: 'POST', path: '/api/notify/weekly', name: 'NotifyWeekly', contentType: 'json' };
    router.mount(
        NotifyWeeklyOptions,
        (req, res) => notificationsController.weekly(req, res)
    );
    
    const BotMessagesOptions: MountOptions = { method: 'POST', path: '/api/messages', name: 'BotMessages', contentType: 'json' };
    router.mount(
        BotMessagesOptions,
        (req, res) => messagingController.messages(req, res)
    );
    return router;
};
