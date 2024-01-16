import addMinutes from "./addMinutes.js"
import { toDateObject } from "./formatDate.js"

/**
 * taskEndTime function
 * Accepts task object and returns a date object set to the time that the task ends (startTime + durationOfTask + durationOfBreak).
 * @param {task} taskObject   task object as defined in server "model"
 * @return {date}             date object
 */
export default function taskEndTime (taskObject){
  const startTm = toDateObject(taskObject.taskDate, taskObject.startTime)
  return addMinutes(startTm, taskObject.durationOfTask + taskObject.durationOfBreak)
}
