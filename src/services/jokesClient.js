const https = require('https');
const paths = require('./paths/jokes.json')
const resParsers = require('./parsers/response.js');
const Injection = require('../configuration/registerTypes.js');

/**
 * Requests jokes from provided services by hostname.
 */
class JokesClient {
    /**
     * Configures client by provided host.
     * @param {string} hostname Hostname of the target service.
     */
    constructor(hostname) {
        this.options = { host: hostname, hostname };
        this.onErrorCallback = null;
        this._paths = paths[hostname];
        this._resParser = resParsers[hostname];
        this._logger = Injection.getInstance('Common.Logger', 'JokesClient');
    }

    /**
     * Get one random joke.
     * @param {function} responseCallback 
     */
    async getJoke() {
        const endpointOptions = this._paths.random;
        const responseParser = this._resParser.random;

        return await this._sendRequest(endpointOptions, responseParser);
    }

    /**
     * Get a list of avalible categories.
     * @param {function} responseCallback 
     */
    async getCategories() {
        const endpointOptions = this._paths.categories;
        const responseParser = this._resParser.categories;

        return await this._sendRequest(endpointOptions, responseParser);
    }

    /**
     * Get one random joke related to category. 
     * @param {string} category A category of joke.
     * @param {function} responseCallback 
     */
    async getJokeByCategory(category) {
        const endpointOptions = this._paths.randomByCategory;
        const responseParser = this._resParser.randomByCategory;
        const requestOptions = Object.assign({}, endpointOptions, {
            path: endpointOptions.path.replace("{0}", encodeURIComponent(category))
        });

        return await this._sendRequest(requestOptions, responseParser);
    }

    /**
     * Only jokes that contain the specified string will be returned.
     * @param {string} term A string that should present in the joke.
     * @param {function} responseCallback 
     */
    async search(term) {
        const endpointOptions = this._paths.search;
        const responseParser = this._resParser.search;
        const requestOptions = Object.assign({}, endpointOptions, {
            path: endpointOptions.path.replace("{0}", encodeURIComponent(term))
        });

        return await this._sendRequest(requestOptions, responseParser);
    }

    _sendRequest(endpointOptions, parseResponse) {
        return new Promise((resolve, reject) => {
            const requestOptions = Object.assign({}, this.options, endpointOptions);
            https.request(requestOptions, res => {
                let resBody = "";

                res.setEncoding('utf8');
                res.on('data', (chunk) => resBody += chunk); // Listen for data and add
                res.on('end', () => resolve(parseResponse(resBody))); // Now that the response is done streaming, parse resBody

                this._logger.logInfo(`Joke response status code: ${res.statusCode}`);
            }).on('error', (error) => {
                this._onError(error);
                reject(error);
            }).end();
        });
    }

    _onError(error) {
        if (this.onErrorCallback) {
            this.onErrorCallback(error)
        }
        this._logger.logError(`Error on requesting joke : ${error}`);
    }
}

module.exports.JokesClient = JokesClient;