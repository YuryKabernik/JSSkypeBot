const https = require('https');
const jokes = require('./paths/jokes.json')
const Injection = require('../configuration/registerTypes.js');

class JokesClient {
    constructor(hostname) {
        this.options = { host: hostname, hostname };
        this.onErrorCallback = null;
        this._logger = Injection.getInstance('Common.Logger', 'JokesClient');
    }

    /**
     * Get one random joke.
     * @param {function} responseCallback 
     */
    async getJoke() {
        const endpointOptions = jokes[this.options.hostname].random;
        return await this._sendRequest(endpointOptions);
    }

    /**
     * Get a list of avalible categories.
     * @param {function} responseCallback 
     */
    async getCategories() {
        const endpointOptions = jokes[this.options.hostname].categories;
        return await this._sendRequest(endpointOptions);
    }

    /**
     * Get one random joke related to category. 
     * @param {string} category A category of joke.
     * @param {function} responseCallback 
     */
    async getJokeByCategory(category) {
        const endpointOptions = jokes[this.options.hostname].randomByCategory;
        endpointOptions.path = endpointOptions.path.replace("{0}", category);

        return await this._sendRequest(endpointOptions);
    }

    /**
     * Only jokes that contain the specified string will be returned.
     * @param {string} term A string that should present in the joke.
     * @param {function} responseCallback 
     */
    async search(term) {
        const endpointOptions = jokes[this.options.hostname].search;
        endpointOptions.path = endpointOptions.path.replace("{0}", term);

        return await this._sendRequest(endpointOptions);
    }

    _sendRequest(endpointOptions) {
        return new Promise((resolve, reject) => {
            const requestOptions = Object.assign(this.options, endpointOptions);
            https.request(requestOptions, res => {
                this._logger.logInfo(`Joke response status code: ${res.statusCode}`);

                let resBody = "";

                res.setEncoding('utf8');
                res.on('data', (chunk) => resBody += chunk); // Listen for data and add
                res.on('end', () => resolve(JSON.parse(resBody))); // Now that the response is done streaming, parse resBody
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