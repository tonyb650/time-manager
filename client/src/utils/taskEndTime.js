import addMinutes from "./addMinutes.js"
import { toDateObject } from "./formatDate.js"

// ~*~* Takes a task object and returns a date object

export default function taskEndTime (taskObject){
  const startTm = toDateObject(taskObject.taskDate, taskObject.startTime)
  return addMinutes(startTm, taskObject.durationOfTask + taskObject.durationOfBreak)
}
