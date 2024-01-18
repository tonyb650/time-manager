/**
 * ISODateString function
 * Accepts date object and returns in ISO date string format
 * @param {date} dateObj   date object eg: 2023-12-23T20:30:00.000Z
 * @return {string}        ISO format date string eg: "2023-12-03"
 */
export function toISODateString(dateObj) {
  const myDate = new Date(dateObj);
  const dayOfMonth = myDate.getDate();
  const month = myDate.getMonth();
  const year = myDate.getFullYear();
  const pad = (n) => (n < 10 ? "0" + n : n);    // 'pad' helper function just adds a leading '0' when needed
  return year + "-" + pad(month + 1) + "-" + pad(dayOfMonth);
}

/**
 * ISODateString function
 * Accepts date string in local format and returns in ISO format
 * @param {string} ISODateString   ISO format date string eg: "2023-12-03"
 * @return {string}                string 'month/day/year' for example: "12/01/2023" (local)
 */
export function toLocalDateString(ISODateString) {
  return (
  ISODateString.substring(5, 7) + "/" +
  ISODateString.substring(8, 10) + "/" +
  ISODateString.substring(0, 4)
  )
}

/**
 * toTimeString function
 * Accepts date object and returns string
 * for *local* time in 24 hours format "HH:mm"
 * @param {date} dateObj   date object eg: 2023-12-23T20:30:00.000Z
 * @return {string}        local 24hr time in format "HH:MM"
 */
export function toTimeString(dateObj) {
  return String(dateObj).substring(16,21);  // This should extract "HH:mm" in 24hr local time
}

/**
 * toDateObject function
 * Accepts date in string form and time in string form and returns a date object.
 * If time HH > 24 then the function will add days as needed.
 * @param {string} dateString   format "YYYY-MM-DD"
 * @param {string} timeString   format "HH:MM"
 * @return {date}               date object eg: 2023-12-23T20:30:00.000Z
 */
export function toDateObject(dateString, timeString){
  if(timeString == ""){                         // Just in case time is an empty string
    timeString = "00:00";
  }
  const dateParts = dateString.split("-");      // split() format = "2012-10-12"
  const timeParts = timeString.split(":");      // split() format = "12:30"
  const addDays = Math.floor(timeParts[0]/24);  // If time is past 11:59pm it can be on the next day or beyond
  const dateObj = new Date(dateParts[0], dateParts[1]-1, dateParts[2], timeParts[0]%24, timeParts[1]);
  dateObj.setDate(dateObj.getDate() + addDays);
  return dateObj;
}

/**
 * toTwelveHour function
 * Accepts time in string format (24 hour)
 * and returns in am/pm format
 * @param {string} timeString   format "HH:MM" (24 hour time)
 * @return {string}             format "hh:mm am/pm" (am/pm time)
 */
export function toTwelveHour(timeString){
  const [hr, minutes] = timeString.split(":")
  const hour = parseInt(hr)
  if (hour == 0) { // 12 am
    return "12:" + minutes + " AM";
  } else if (hour < 12) {//1-11 am
    return hour + ":" + minutes + " AM";
  } else if (hour == 12) { // 12 pm
    return "12:" + minutes + " PM";
  } else if (hour >12 && hour < 24) {// 1-11 pm
    return hour%12 + ":" + minutes + " PM";
  } else {
    throw "invalid time string " + timeString;
  }  
}
