/**
 * @file Middlware array initialization.
 */
import { BotFrameworkAdapter } from 'botbuilder';
import { trustServiceUrl } from '../middleware/proactive';
import { promptParser } from '../middleware/prompt';

/**
 * Register proactive middlewares.
 */
export default {
    Register(adapter: BotFrameworkAdapter) {
        const middlewares = [
            trustServiceUrl,
            promptParser
        ];

        if (middlewares && middlewares.every(middleware => typeof (middleware) === 'function')) {
            middlewares.forEach(middleware => adapter.use(middleware));
        }
    }
}
