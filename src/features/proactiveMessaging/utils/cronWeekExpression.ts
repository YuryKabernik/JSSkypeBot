/**
 * Transforms date to cron-format date expression.
 * @param stringDate Date as a sting value.
 */
export function cronWeekExpression(stringDate: string | Date) {
    const date = new Date(stringDate);
    return `${ date.getMinutes() || 0 } ${ date.getHours() } * * ${ date.getDay() }`;
}
