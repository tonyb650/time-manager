import axios from "axios";
import addMinutes from "./addMinutes";
import taskEndTime from "./taskEndTime";

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
    let x = String(a.startTime);
    let y = String(b.startTime);
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
  // * If no tasks have a startTime (index 0 is null), set nextAvailableStart to 8:00am
  if (tempArr[0].startTime == null) {
    // console.log("handling edge case in sortTasks")
    let renderDate = new Date(tempArr[0].taskDate);
    nextAvailableStart = new Date(
      renderDate.getFullYear(),
      renderDate.getMonth(),
      renderDate.getDate(),
      8
    ); // here we are setting default to "8:00am"
  } else {
    nextAvailableStart = new Date(tempArr[0].startTime);
  }

  // *~*~ Loop through 'tempArr' array until all elements are popped
  while (tempArr.length > 0) {
    // * We will push the task in position [0] onto the 'resultArr' and shift (remove) it from the 'tempArr' array
    // *
    // * But first, if any of these conditions are true, we need to make update(s) to the given task and save to DB. CONDITIONS:
    // * CONDITION # 1: startTime == null --> set startTime
    // * CONDITION # 2: startTime != null BUT it is too early (<NextAvailableTime) --> set startTime
    // * CONDITION # 3: isPinnedStartTime == false --> set startTime
    // *        plus if the task is the first task of the day --> set isPinnedStartTime to true
    // TODO: Will there be instances where we need to null out actualDuration if we are changing startTime ?
    if (
      new Date(tempArr[0].startTime) == null ||
      new Date(tempArr[0].startTime) < nextAvailableStart ||
      tempArr[0].isPinnedStartTime == false
    ) {
      if (tempArr[0]._id == firstId) {
        tempArr[0].isPinnedStartTime = true; // if this is the first task, we automatically want to set it as pinned.
      }
      // * Set startTime to nextAvailableStart
      tempArr[0].startTime = nextAvailableStart.toISOString();
      // * Now save to DB with updated 'startTime'
      axios
        .patch(`http://localhost:8000/api/tasks/${tempArr[0]._id}`, tempArr[0])
        .then((res) => console.log("saved with new startTime"))
        .catch((err) => console.error(err)); // throw here?
    } else {
      // * If task is pinned and there is no time conflict, simply update nextAvailableStart to the task's startTime
      nextAvailableStart = new Date(tempArr[0].startTime);
    }
    // * Check if current time is later than end time of this task. If so, make sure that actualTotalDuration
    // * is set correctly and save to DB
    if (taskEndTime(tempArr[0]) < new Date()) {
      // console.log(tempArr[0].taskTitle + " must be complete ");
      tempArr[0].actualTotalDuration =
        tempArr[0].durationOfTask + tempArr[0].durationOfBreak;
    } else {
      // console.log("not complete")
      tempArr[0].actualTotalDuration = null;
    }

    // * Push to 'results' and shift from 'temp'
    resultArr.push(tempArr.shift());
    // *~*~ Update 'nextAvailableStart' to be immediately after this task
    nextAvailableStart = addMinutes(
      nextAvailableStart,
      resultArr[resultArr.length - 1].durationOfTask +
        resultArr[resultArr.length - 1].durationOfBreak
    );
  }
  // console.log("The final resultArr after filtering and sorting to be rendered: ")
  // console.log(resultArr);
  return resultArr;
}
