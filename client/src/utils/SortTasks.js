import taskEndTime from "./taskEndTime";
import { toDateObject, toTimeString } from "./formatDate";
import patchTask from "./patchTask";

export default function SortTasks(tempArr) {
  console.log("Called SortTasks");

  // *If passed-in array is empty, return empty array
  if (tempArr.length == 0) {
    return [];
  }

  // * Sort the tasks by 'startTime', earliest times first. Any "null" startTimes will be at the end
  tempArr.sort(function (a, b) {
    let x = String(toDateObject(a.taskDate,a.startTime));
    let y = String(toDateObject(b.taskDate,b.startTime));
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });

  let resultArr = [];                                             // Initialize the final results array & default nextAvailableStart
  let firstId = tempArr[0]._id;                                   // Initialize firstId (used later to set isPinned to true if needed)
  let nextAvailableStart = toDateObject(tempArr[0].taskDate, tempArr[0].startTime);    // Initialize nextAvailableStart with the startTime from first task

  // *Loop through 'tempArr' to process each task until tempArr is empty*
  while (tempArr.length > 0) {
    
    let currentTask = tempArr.shift();                            // Remove a task to be processed from the front of the tempArr array
    let isTaskModified = false;                                   // Set a flag for whether or not we will need to save changes to DB
    
    // * Check if we need to change 'isPinnedStartTime' status *
    if (currentTask._id == firstId && currentTask.isPinnedStartTime == false) {
      currentTask.isPinnedStartTime = true;                       // if this is the first task, we automatically want to set it as pinned.
      isTaskModified = true;                                      // flag for update in DB
    }
    
    // * Check if we need to change 'startTime' to 'nextAvailableStart' *
    // TODO: Will there be instances where we need to null out actualDuration if we are changing startTime ?
    if (
      toDateObject(currentTask.taskDate,currentTask.startTime) < nextAvailableStart ||
      currentTask.isPinnedStartTime == false
    ) {
      currentTask.startTime = toTimeString(nextAvailableStart);   // Set startTime. Format "HH:mm" in 24hr local time
      isTaskModified = true;                                      // flag for update in DB
    } 

    // * Check if current time is later than end time of this task. If so, make sure to set actualTotalDuration
    if (taskEndTime(currentTask) < new Date() ) {                 // If this is true, then the task *must* be complete
      if( currentTask.actualTotalDuration != currentTask.durationOfTask + currentTask.durationOfBreak){
        currentTask.actualTotalDuration = currentTask.durationOfTask + currentTask.durationOfBreak;
        isTaskModified = true;
      }
    } else if (currentTask.actualTotalDuration != null) {         // task *must not* be complete, so check if we need to change it
      currentTask.actualTotalDuration = null;                     // task is not completed, so set actualTotalDuration to null
      isTaskModified = true;                                      // flag for update in DB
    }

    // *If currentTask has been flagged as modified, update it in DB*
    if(isTaskModified){
      patchTask(currentTask, false, "Patched task as part of sorting process in SortTask.js")   // Update this task in DB
    }

    nextAvailableStart = taskEndTime(currentTask)                 // Update 'nextAvailableStart' to be immediately after this task
    resultArr.push(currentTask);                                  // Push processed task to 'results' array
  }
  // console.log("The final resultArr after filtering and sorting to be rendered: ")
  // console.log(resultArr);
  return resultArr;
}
