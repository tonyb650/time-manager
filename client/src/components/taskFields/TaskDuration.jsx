import { useContext, useEffect, useState } from "react";
import TaskListContext from "../../context/TaskListContext";
import SortTasks from "../../utils/SortTasks";
import patchTask from "../../utils/patchTask";

function TaskDuration(props) {
  const { task, index } = props;
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const [ duration, setDuration ] = useState(task.durationOfTask);

  // TODO: I'm questioning if there is a problem with using useEffect to re-render on props but it is working so I'll live with it for now
  // Note: without this useEffect, value={duration} lags behind on each re-render of the page
  // More reading: https://tkdodo.eu/blog/putting-props-to-use-state 
  useEffect(()=>{
    setDuration(task.durationOfTask + " min")
  },[task, taskList])

  // *Handle change/keystrokes*
  const handleChange = (e) => {
    setDuration(e.target.value);
  };

   // *This handles an 'enter' keypress. It would be nice to have enter act like 'tab' instead of submit...*
  const handleSubmit = (e) => {  
    e.preventDefault();
    handleBlur();
  }
  
  // *This handles 'tab' or clicking off the input field*
  const handleBlur = () => {
    let targetTask = {...task}                          // Make working copies of task and taskList
    let taskListCopy = [...taskList]

    let displayDuration = parseInt(duration.trim());
    if (isNaN(displayDuration)){                        // Check if there is no valid numeric value
      displayDuration = 1;                              // If so, set duration to 1 minute
    }
    setDuration(displayDuration+" min");                // Add " min" to the numeric value
    targetTask.durationOfTask = displayDuration;        // update durationOfTask on copy
    taskListCopy[index] = targetTask;                   // update taskList copy with updated task

    //TODO: possible way to handle automatic unpausing ( might be desirable to unpause if shortening duration of current & paused task makes end of task time earlier than current time)
    // call activeID utility function --> pass in sorted taskListCopy, get back taskID of newly active task (if any)
    // if newly activeID != pausedID, then set pausedID to null 

    patchTask(targetTask, false, "Patched targetTask successful in TaskDuration.jsx")       // Update this task in DB
    setTaskList(SortTasks( taskListCopy ));             // sort taskList and then update context taskList
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className="form-control form-control-sm px-1" type="text" onBlur={handleBlur} onChange={handleChange}
      value={duration}/>
    </form>
  )
}

export default TaskDuration;