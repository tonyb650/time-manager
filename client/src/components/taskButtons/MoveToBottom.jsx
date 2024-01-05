import React, { useContext } from "react";
import chevron2down from "../../assets/img/chevron-double-down.svg";
import axios from "axios";
import TaskListContext from "../../context/TaskListContext";
import SortTasks from "../../utils/SortTasks";
import addMinutes from "../../utils/addMinutes";

function MoveToBottom(props) {
  const { taskList, setTaskList } = useContext(TaskListContext);
  const { task, index } = props;


  const handleClick = () => {
    // TODO: I feel like there might be a better way than creating copies in these next 2 lines(?)

    let targetTask = { ...task };
    let taskListCopy = [...taskList]

    // *If the target task is the last or the only task, nothing will happen (return null)
    if (index == taskListCopy.length - 1) {
      console.log("this is already the last task");
      return null;
    }

    // * The prior ending time for the prior final task becomes the startTime for the target task
    const priorLastTask = taskListCopy[taskListCopy.length-1]
    const priorEndTime = addMinutes(new Date(priorLastTask.startTime), priorLastTask.durationOfTask + priorLastTask.durationOfBreak);
    // TODO: If newEarliest < midnight, then set to midnight and reschedule every task in the day.
    targetTask.startTime = priorEndTime.toISOString();
    const newEndTime = addMinutes(priorEndTime, targetTask.durationOfTask + targetTask.durationOfBreak)
    
    // * If the new end time for the task is after current time, then clear 'isComplete' and 'actualDuration'
    // * otherwise, leave them untouched
    if(newEndTime > new Date()){
      // targetTask.isComplete = false;
      targetTask.actualTotalDuration = null;
    }
    // * By moving to the bottom, we are 'unpinning' this task
    targetTask.isPinnedStartTime = false;

    // If new 'first' task is not already 'pinned' then set PinnedStartTime = true and save record to DB
    if(!taskListCopy[1].isPinnedStartTime){
      taskListCopy[1].isPinnedStartTime = true;
      axios.patch(`http://localhost:8000/api/tasks/${taskListCopy[1]._id}`, taskListCopy[1])
      .then(res => { 
        console.log("Patched new earliest (now pinned)");
      })
      .catch(err => console.error(err));
    }

    // * Update context
    taskListCopy[index] = targetTask;
    setTaskList(SortTasks( taskListCopy ));

    // * Now save updated targetTask to DB
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => { 
      console.log("Patched targetTask successful");
      console.log(taskListCopy)
    })
    .catch(err => console.error(err));
  }

  return (
    <button
      className="btn btn-sm btn-light my-1"
      onClick={handleClick}
      value={task._id}
    >
      <img src={chevron2down} /> Btm
    </button>
  );
}

export default MoveToBottom;
