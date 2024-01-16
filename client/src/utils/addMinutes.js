/**
 * ISODateString function
 * Accepts date object and returns in ISO date string format
 * @param {date} dateObject   date object eg: 2023-12-23T20:30:00.000Z
 * @param {number} minutes    number of minutes to add, eg: 30
 * @return {date}             date object eg: 2023-12-23T21:00:00.000Z
 */
export default function addMinutes (dateObject,minutes){
    return new Date(dateObject.getTime() + minutes*60*1000)
}