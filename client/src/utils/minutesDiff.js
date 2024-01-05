// * takes in two date objects and returns absolute value of difference (integer of minutes)

export default function minutesDiff(dateTimeValue2, dateTimeValue1) {
    var differenceValue =(dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
    differenceValue /= 60;
    return Math.abs(Math.round(differenceValue));
 }