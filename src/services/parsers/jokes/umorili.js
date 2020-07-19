function getRandomIndex(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * This module allows us to parse complex API response in the simple structure.
 * Key - endpoint name or identifier.
 * Value - response parser function.
 */
module.exports = {
    "random": (body) => {
        const jokes = JSON.parse(body);
        if (typeof jokes === 'object') {
            return {
                joke: jokes[getRandomIndex(jokes.length)].elementPureHtml
            };
        }

        return null;
    },
    "categories": (body) => {
        const sources = JSON.parse(body);
        if (typeof sources === 'object') {
            return {
                categories: sources
                    .reduce((accomulator, source) => accomulator.concat(source))
                    .map(category => category.name)
            };
        }

        return null;
    },
    "randomByCategory": (body) => {
        const jokes = JSON.parse(body);
        if (typeof jokes === 'object') {
            const index = getRandomIndex(jokes.length);

            return {
                joke: jokes[index].elementPureHtml
            };
        }

        return null;
    },
    "search": (body) => JSON.parse(body)
}