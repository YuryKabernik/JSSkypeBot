function cronWeekExpression(stringDate) {
    const date = new Date(stringDate);
    const hours = date.getHours();
    const minutes = date.getMinutes() || 0;
    const day = date.getDay();
    return `${ minutes } ${ hours } * * ${ day }`;
}

module.exports.cronWeekExpression = cronWeekExpression;
