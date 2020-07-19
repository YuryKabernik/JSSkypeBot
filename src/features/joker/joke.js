const Injection = require('../../configuration/registerTypes.js');

class Jokes {
    constructor() {
        this._logger = Injection.getInstance('Common.Logger', 'JokesClient');
        this._jokesService = Injection.getInstance('Services.JokesClient');
    }

    async getJoke() {
        try {
            return await getJoke();
        } catch (error) {
            this._logger.logError("Error on requesting random joke.");
        }
    }

    async getCategories() {
        try {
            return await this._jokesService.getCategories();
        } catch (error) {
            this._logger.logError("Error on requesting joke categories.");
        }
    }

    async getJokeByCategory(catergory) {
        try {
            return await this._jokesService.getJokeByCategory(catergory);
        } catch (error) {
            this._logger.logError(`Error on requesting joke by category "${category}" \n ${error}`);
        }
    }

    async search(term) {
        try {
            return await this._jokesService.search(term);
        } catch (error) {
            this._logger.logError(`Error on seaching joke by term "${term}" \n ${error}`);
        }
    }
}

module.exports.Jokes = Jokes;
