import React, { useContext, useEffect, useState } from "react";
import TaskListContext from "../../context/TaskListContext";
import SortTasks from "../../utils/SortTasks";
import axios from "axios";

function TaskDuration(props) {
  const { task, index } = props;
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const [ duration, setDuration ] = useState(task.durationOfTask);
  
  let targetTask = {...task}
  let taskListCopy = [...taskList]

  // TODO: I'm pretty sure there is a problem with using useEffect to re-render on props but it is working so I'll live with it for now
  // Note: without this useEffect, value={duration} lags behind on each re-render of the page
  // More reading: https://tkdodo.eu/blog/putting-props-to-use-state 
  useEffect(()=>{
    setDuration(task.durationOfTask + " min")
  },[task])

   // This handles an 'enter' keypress. It would be nice to have enter act like 'tab' instead of submit...
  const handleSubmit = (e) => {  
    e.preventDefault();
    handleBlur();
  }
  
  // This handles 'tab' or clicking off the input field
  const handleBlur = () => {
    console.log("handleBlur")
    let displayDuration = parseInt(duration.trim());
    if (displayDuration == NaN ){
      setDuration("0 min");
    } else {
      setDuration(displayDuration+" min");
    }
    // * Update context (taskList)
    targetTask.durationOfTask = displayDuration;
    taskListCopy[index] = targetTask;
    setTaskList(SortTasks( taskListCopy ));
    // * Now save updated targetTask to DB
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => {})
    .catch(err => console.error(err));
  };

  // Handle change/keystrokes
  const handleChange = (e) => {
    setDuration(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className="form-control form-control-sm px-1" type="text" onBlur={handleBlur} onChange={handleChange}
      value={duration}/>
  </form>

  )
}

export default TaskDuration;