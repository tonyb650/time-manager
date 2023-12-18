// ~*~* Takes a date object and returns a date object

export default function addMinutes (dateObject,minutes){
    return new Date(dateObject.getTime() + minutes*60*1000)
}