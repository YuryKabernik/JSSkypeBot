function cronWeekExpression(datedObject) {
    const date = new Date(datedObject.date);
    const hours = date.getHours();
    const minutes = date.getMinutes() || 0;
    const day = date.getDay();
    const dateExpression = `${ minutes } ${ hours } * * ${ day }`;
    return dateExpression;
}

module.exports.cronWeekExpression = cronWeekExpression;
