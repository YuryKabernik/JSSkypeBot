import * as fs from 'fs';
import * as PropertiesReader from 'properties-reader';

const answers: { [index: string]: any } = {};

(function concatProperties() {
    if (!answers.length) {
        const pathsToPropertyFiles = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.properties'))
            .map(fileName => `${__dirname}/${fileName}`);
        pathsToPropertyFiles.forEach(path => {
            const pr = PropertiesReader(path)
            Object.assign(answers, pr.getAllProperties());
        });
    }
})();

export default answers;
