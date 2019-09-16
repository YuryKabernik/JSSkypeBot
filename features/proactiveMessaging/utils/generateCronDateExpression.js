const monthList = require('./months.json');

function generateCronDateExpression(iteration) {
    const allMonth = monthList;
    const date = new Date(iteration.date);
    const month = allMonth[date.getMonth()];
    const dateDay = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const dateExpression = `${ seconds } ${ minutes } ${ hours } ${ dateDay } ${ month } *`;
    return dateExpression;
}

module.exports.generateCronDateExpression = generateCronDateExpression;
