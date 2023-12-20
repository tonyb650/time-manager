import React, { useContext } from "react";
import chevron2down from "../../assets/img/chevron-double-down.svg";
import axios from "axios";
import TaskListContext from "../../context/TaskListContext";
import SortTasks from "../../utils/SortTasks";
import addMinutes from "../../utils/addMinutes";

function MoveToBottom(props) {
  const { taskList, setTaskList } = useContext(TaskListContext);
  const { task, index, needsUpdate, setNeedsUpdate } = props;

  const handleClick = (e) => {
    e.preventDefault();
    // TODO: I feel like there might be a better way than creating copies in these next 2 lines(?)
    let targetTask = { ...task };
    let taskListCopy = [...taskList];

    // *If the target task is the last or the only task, nothing will happen (return null)
    if (index == taskListCopy.length - 1) {
      console.log("this is already the last task");
      return null;
    }

    // TODO: If new startTimeScheduled > midnight, then open model to confirm moving the task to the next day

    // *Loop through all tasks that come AFTER the targetTask. (Tasks that come before will be untouched.)
    for(let i=index+1; i<taskListCopy.length;i++){
      // *Look for a child of the target task, and if found, set child's parentId to target task.parentId (which may be null)
      if(taskListCopy[i].parentId == targetTask._id){
        taskListCopy[i].parentId = targetTask.parentId;
        taskListCopy[i].startTimeScheduled = targetTask.startTimeScheduled;
      } else if(taskListCopy[i].startTimeScheduled != null && index != 0){
      // *Move all the 'startTimeScheduled' for tasks that come after the targetTask up by duration of targetTask (plus break)
        taskListCopy[i].startTimeScheduled = addMinutes(new Date(taskListCopy[i].startTimeScheduled),-(targetTask.durationOfBreak+targetTask.durationOfTask)).toISOString();
      }
          // * Now save updated targetTask to DB
      axios.patch(`http://localhost:8000/api/tasks/${taskListCopy[i]._id}`, taskListCopy[i])
      .then(res => {
        console.log("Patch successful");
        console.log("taskListCopy after .then")
        console.log(taskListCopy)
        // setNeedsUpdate(!needsUpdate);
      })
      .catch(err => console.error(err));
    }
    // *Set target parentId to null (since we are breaking any linkage it has)
    targetTask.parentId = null;
    // *Retrieve the next available start time after the existing final task of the day
    let currentLastTask = taskListCopy[taskListCopy.length - 1];
    const currentEndTime = addMinutes(new Date(currentLastTask.startTimeScheduled), currentLastTask.durationOfTask + currentLastTask.durationOfBreak);
    console.log("currentEndTime " + currentEndTime);
    // // *Subtract the durationOfTask and durationOfBreak from priorEarliest and this becomes our new scheduledStartTime for the target task
    // const newEarliest = new Date(priorEarliest-taskListCopy[index].durationOfTask*60*1000-taskListCopy[index].durationOfBreak*60*1000);

    targetTask.startTimeScheduled = currentEndTime.toISOString();
    taskListCopy[index] = targetTask;
    console.log("***** HERE IT IS: ")
    console.log(taskListCopy)
    setTaskList(SortTasks( taskListCopy ));

    // * Now save updated targetTask to DB
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => {
      console.log("Patch successful");
      console.log("taskListCopy after .then")
      console.log(taskListCopy)
      //setNeedsUpdate(!needsUpdate);
    })
    .catch(err => console.error(err));
  }

  return (
    <button
      className="btn btn-sm btn-light my-1"
      onClick={(e) => {
        handleClick(e);
      }}
      value={task._id}
    >
      <img src={chevron2down} /> Btm*
    </button>
  );
}

export default MoveToBottom;
