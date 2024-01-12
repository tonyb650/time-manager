import axios from "axios";
import addMinutes from "./addMinutes";
import taskEndTime from "./taskEndTime";
import { toDateObject, toTimeString } from "./formatDate";

// HOW TASKS ARE ARRANGED(SORTED) FOR THE DAY:
// TODO: fix this comment
// Pattern: 1) set time to NextAvail 2) save to DB (as needed) 3) push/shift  4) Update nextAvail

export default function SortTasks(tempArr) {
  console.log("Called SortTasks");
  // *If passed-in array is empty, return empty array
  if (tempArr.length == 0) {
    return [];
  }

  // *~*~ Initialize the final results array & default nextAvailableStart
  let resultArr = [];

  // *~*~ Sort the tasks by 'startTime', earliest times first and this also puts "null" at the end
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

  // * Initialize nextAvailableStart
  let nextAvailableStart = null;
  // * Initialize firstId (used later to set isPinned to true if needed)
  let firstId = tempArr[0]._id;

  // *************** PROBABLY REMOVE ************
  // * If no tasks have a startTime (index 0 is null), set nextAvailableStart to 8:00am
  // if (tempArr[0].startTime == null) {
  //   // console.log("handling edge case in sortTasks")
  //   let renderDate = toDateObject(tempArr[0].taskDate,"00:00");
  //   nextAvailableStart = new Date(
  //     renderDate.getFullYear(),
  //     renderDate.getMonth(),
  //     renderDate.getDate(),
  //     8
  //   ); // here we are setting default to "8:00am"
  // } else {
  //   nextAvailableStart = new Date(tempArr[0].startTime);
  // }
  // **************************************************
  nextAvailableStart = toDateObject(tempArr[0].taskDate, tempArr[0].startTime);
  // console.log("!!!!!!!!setting it up")
  // console.log(tempArr[0].taskDate)
  // console.log(tempArr[0].startTime)
  // console.log(nextAvailableStart)
  // *~*~ Loop through 'tempArr' array until all elements are popped
  while (tempArr.length > 0) {
    // * We will push the task in position [0] onto the 'resultArr' and shift (remove) it from the 'tempArr' array
    // ***************** NEED TO REDO THESE COMMENTS ********************
    // *
    // * But first, if any of these conditions are true, we need to make update(s) to the given task and save to DB. CONDITIONS:
    // * CONDITION # 1: startTime == null --> set startTime
    // * CONDITION # 2: startTime != null BUT it is too early (<NextAvailableTime) --> set startTime
    // * CONDITION # 3: isPinnedStartTime == false --> set startTime
    // *        plus if the task is the first task of the day --> set isPinnedStartTime to true
    // TODO: Will there be instances where we need to null out actualDuration if we are changing startTime ?
    //***********************************************************************
    
    let currentTask = tempArr.shift();      // Remove a task to be processed from the front of the tempArr array
    let isTaskModified = false;             // Set a flag for whether or not we will need to save changes to DB

    // * Check if we need to change 'isPinnedStartTime' status *
    if (currentTask._id == firstId && currentTask.isPinnedStartTime == false) {
      currentTask.isPinnedStartTime = true; // if this is the first task, we automatically want to set it as pinned.
      isTaskModified = true;                // flag for update in DB
    }

    // * Check if we need to change 'startTime' to 'nextAvailableStart' *
    if (
      toDateObject(currentTask.taskDate,currentTask.startTime) < nextAvailableStart ||
      currentTask.isPinnedStartTime == false
    ) {
      // console.log("nextAvailableStart")
      // console.log(String(nextAvailableStart))
      currentTask.startTime = toTimeString(nextAvailableStart);  // This should extract "HH:mm" in 24hr local time
      // console.log("New start time: "+ currentTask.startTime)
      isTaskModified = true;                // flag for update in DB
    } 

    // * Check if current time is later than end time of this task. If so, make sure that actualTotalDuration
    if (taskEndTime(currentTask) < new Date() ) { // If this is true, then the task *must* be complete
      if( currentTask.actualTotalDuration != currentTask.durationOfTask + currentTask.durationOfBreak){
        currentTask.actualTotalDuration = currentTask.durationOfTask + currentTask.durationOfBreak;
        isTaskModified = true;
      }
    } else if (currentTask.actualTotalDuration != null) { // task *must not* be complete
      // console.log("not complete")
      currentTask.actualTotalDuration = null;
      isTaskModified = true;                // flag for update in DB
    }

    // * If currentTask has been modified, update it in DB
    if(isTaskModified){
      axios
      .patch(`http://localhost:8000/api/tasks/${currentTask._id}`, currentTask)
      .then((res) => {
        // console.log("saved with new startTime")
      })
      .catch((err) => console.error(err)); // throw here?
    }

    // *~*~ Update 'nextAvailableStart' to be immediately after this task
    nextAvailableStart = taskEndTime(currentTask)

    // * Push processed task to 'results' array
    resultArr.push(currentTask);

  }
  // console.log("The final resultArr after filtering and sorting to be rendered: ")
  // console.log(resultArr);
  return resultArr;
}
