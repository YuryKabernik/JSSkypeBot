const fs = require('fs');
const path = require('path');
const { parse } = require('dot-properties');

const answers = {};

(function concatProperties() {
    if (!answers.length) {
        const pathsToPropertyFiles = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.properties'))
            .map(fileName => path.join(__dirname, fileName));
        pathsToPropertyFiles.forEach(path => {
            const src = fs.readFileSync(path, {
                encoding: 'utf8'
            });
            Object.assign(answers, parse(src));
        });
    }
})();

module.exports.answers = answers;
