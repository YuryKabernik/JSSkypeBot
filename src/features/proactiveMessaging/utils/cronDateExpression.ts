import * as monthList from './months.json';

export function cronDateExpression(dateValue: string | Date) {
    const date = new Date(dateValue);
    const month = monthList[date.getMonth()];
    return `${ date.getSeconds() } ${ date.getMinutes() } ${ date.getHours() } ${ date.getDate() } ${ month } *`;
}
