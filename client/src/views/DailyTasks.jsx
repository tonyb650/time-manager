import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Task from "../components/Task";
import DatePicker from "../components/DatePicker";
import DisplayClock from "../components/DisplayClock";
import addMinutes from "../utils/addMinutes";

function DailyTasks(props) {
  // Initialize state
  const [taskList, setTaskList] = useState([]);
  const [currTime, setCurrTime] = useState();
  const [renderDate, setRenderDate] = useState(new Date()); // 'renderDate' is a Date object
  const [needsUpdate, setNeedsUpdate] = useState(false);

  // ~*~*~ Load main content
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks")
      .then((res) => {
        console.log("Loaded all tasks from DB: ");
        console.log(res.data)
        // *~*~ Filter res.data (all tasks) down to only tasks with taskDate = renderDate
        // TODO: make sure that filter will work in all time zones
        let tasksForDay = res.data.filter(
          (element) =>
            new Date(element.taskDate).toLocaleDateString().substring(0, 10) ==
            renderDate.toLocaleDateString().substring(0, 10)
        );
        setTaskList(sortTasks(tasksForDay));
      })
      .catch((err) => console.log(err));
  }, [renderDate]);

  useEffect(() => {
    console.log("resorting")
    setTaskList(sortTasks(taskList))
  },[needsUpdate])

  // HOW TASKS ARE ARRANGED(SORTED) FOR THE DAY:
  // 1) Sort 'tempArr' by 'startTimeScheduled', earliest first. This automatically puts 'null' times at the end (these are tasks that have a parent or haven't had a time set yet.)
  // 2) Move each task from 'tempArr' to 'resultArr' as it is processed. There are three types of tasks:
  // 2a) Tasks with a startTimeScheduled. These are not linked to parents.
  // 2b) Tasks with a parentID. These will have 'startTimeScheduled' == null.
  // 2c) Tasks with no parentID AND startTimeScheduled == null. This are freshly added tasks and will have startTimeScheduled defined and saved in this function
  // 3) Update value for 'nextAvailableStart' as each task is processed (this will default to 8:00am local time, and increase from there)
  // 4) Unless task has a 'parentId' or existing startTimeScheduled is greater than nextAvailableStart, assign nextAvailableStart to startTimeScheduled and *save to DB*
  // 5) After all items are processed (temArr is empty), return resultArr.
  // Pattern: 1) set time to NextAvail 2) save to DB (as needed) 3) push/shift  4) Update nextAvail

  function sortTasks(tempArr) {

    // *~*~ Initialize the final results array & default nextAvailableStart
    let resultArr = [];
    // let nextAvailableStart = new Date(renderDate.getFullYear(), renderDate.getMonth(), renderDate.getDate(), 0); // here we are setting default to "0:00am"
    let nextAvailableStart = null;

    // *~*~ Sort the tasks by 'startTimeScheduled', earliest times first and this automatically puts "null" at the end
    tempArr.sort(function (a, b) {
      let x = String(a.startTimeScheduled);
      let y = String(b.startTimeScheduled);
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    // *~*~ Loop through 'tempArr' array until all elements are popped
    while (tempArr.length > 0) {

      // *~*~ Start by checking for tasks that have defined startTime
      if (tempArr[0].startTimeScheduled != null) {
        // *~*~ We are in the first section of the list where times are defined (aka: parents or unattached)
        // *~*~ We will push the task in position [0] onto the 'tempArr' and shift (remove) it from the 'tempArr' array
        // But first, if startTimeScheduled < nextAvailableStartTime, the change startTimeScheduled
        if(new Date(tempArr[0].startTimeScheduled) < nextAvailableStart) {
          tempArr[0].startTimeScheduled = nextAvailableStart;
          // Now save to DB with updated 'startTimeScheduled'
          axios.patch(`http://localhost:8000/api/tasks/${tempArr[0]._id}`,tempArr[0])
            .then(res => console.log("saved with new startTimeScheduled"))
            .catch(err=> console.error(err)); // throw here?
        } else {
          nextAvailableStart = new Date(tempArr[0].startTimeScheduled);
        }
        resultArr.push(tempArr.shift());
        // *~*~ Update 'nextAvailableStart' to be immediately after this task
        nextAvailableStart = addMinutes(nextAvailableStart,resultArr[resultArr.length-1].durationOfTask + resultArr[resultArr.length-1].durationOfBreak)

        // *~*~ Now, loop through remaining entries to look for children of the task we just pushed
        for (let i = 0; i < tempArr.length; i++) {
          // *~*~ Check if task at [i] is a child
          if (tempArr[i].parentId == resultArr[resultArr.length - 1]._id) {// Is it a child? If yes, then push to resultArr and splice from tempArr
            // *~*~ Here we are processing the "child"
            // *~*~ Assign nextAvailableStart to the "child"
            tempArr[i].startTimeScheduled = nextAvailableStart;
            // *~*~ Add this "child" to resultArr
            resultArr.push(tempArr[i]);
            // *~*~ Remove the 'pushed' entry from the tempArr array
            tempArr.splice(i, 1);
            // *~*~ Update 'nextAvailableStart' to be immediately after this "child" task
            nextAvailableStart = addMinutes(nextAvailableStart,resultArr[resultArr.length-1].durationOfTask + resultArr[resultArr.length-1].durationOfBreak)
            // Note: because this task has a parent, we are not saving it to DB
            i = -1; // *~*~ Since we found a child, we need to start over at beginning of array to see if there is a child for the newest entry pushed onto resultArr
          }
        }
      } else {
        // we are in the second section of the list: either orphaned OR newly added tasks with no startTimeScheduled
        if (tempArr[0].parentId == null) {
          // look for newly added tasks (no start time, no parents)
          // set 'startTimeScheduled' on this task to 'nextAvailableStart'
          // But first, if this is the first task of the day, nextAvailableStart will still be set to null and we need to give it a default
          if(nextAvailableStart==null){
            nextAvailableStart = new Date(renderDate.getFullYear(), renderDate.getMonth(), renderDate.getDate(), 8); // here we are setting default to "8:00am"
          }
          tempArr[0].startTimeScheduled = nextAvailableStart.toISOString();
          // Now save to DB with updated 'startTimeScheduled'
          axios.patch(`http://localhost:8000/api/tasks/${tempArr[0]._id}`,tempArr[0])
            .then(res => console.log("saved with new startTimeScheduled"))
            .catch(err=> console.error(err)); // throw here?
          // Add to 'resultArr' and remove from 'tempArr'
          resultArr.push(tempArr.shift());
          // *~*~ Update 'nextAvailableStart' to be immediately after this task
          nextAvailableStart = addMinutes(nextAvailableStart,resultArr[resultArr.length-1].durationOfTask + resultArr[resultArr.length-1].durationOfBreak)
        } else {
          // look for orphans (has parentId but we never processed that parent)
          // this means we have an entry with parentId where the parent was never found above
          throw "should never get here";
        }
      }
    }
    // console.log("The final resultArr after filtering and sorting to be rendered: ")
    // console.log(resultArr);
    return resultArr;
  }

  return (
    <div className="container">
      <DisplayClock currTime={currTime} setCurrTime={setCurrTime} />
      <Link to="/tasks/add">Add Task</Link>
      <DatePicker setRenderDate={setRenderDate} />
      {taskList.map((task, index) => {
        return (
          <div key={index}>
            <Task
              task={task}
              index={index}
              taskList={taskList}
              setTaskList={setTaskList}
              needsUpdate={needsUpdate}
              setNeedsUpdate={setNeedsUpdate}
            />
          </div>
        );
      })}
    </div>
  );
}

export default DailyTasks;

















// DOES THIS BUFFER HELP PROTECT?

