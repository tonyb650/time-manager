/**
 * minutesDiff function
 * Accepts two date objects and returns absolute value of difference (integer of minutes)
 * @param {date} dateTimeValue2   date object eg: 2023-12-23T20:30:00.000Z
 * @param {date} dateTimeValue1   date object eg: 2023-12-23T20:30:00.000Z
 * @return {number}               difference between two dates in minutes (always positive)
 */
export default function minutesDiff(dateTimeValue2, dateTimeValue1) {
    var differenceValue =(dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
    differenceValue /= 60;
    return Math.abs(Math.round(differenceValue));
 }