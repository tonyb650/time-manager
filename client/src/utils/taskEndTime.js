import addMinutes from "./addMinutes"

// ~*~* Takes a task object and returns a date object

export default function taskEndTime (taskObject){
    return addMinutes(new Date(taskObject.startTime), taskObject.durationOfTask + taskObject.durationOfBreak)
}