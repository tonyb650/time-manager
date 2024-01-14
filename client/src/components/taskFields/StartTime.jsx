import { useContext, useEffect, useState } from "react";
import TaskListContext from "../../context/TaskListContext";
import SortTasks from "../../utils/SortTasks";
import axios from "axios";
import { toDateObject } from "../../utils/formatDate";
import addMinutes from "../../utils/addMinutes";

function StartTime(props) {
  const { task, index } = props;
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const [startTime, setStartTime] = useState(task.startTime);

  // TODO: I'm pretty sure there is a problem with using useEffect to re-render on props but it is working so I'll live with it for now
  // Note: without this useEffect, the form value lags behind on each re-render of the page
  // More reading: https://tkdodo.eu/blog/putting-props-to-use-state 
  useEffect(()=>{
    setStartTime(task.startTime);
  },[task, taskList])

  function handleChange(e){
    setStartTime(e.target.value);
  }

  function handleSubmit(e) {        // TODO: this handler may not be necessary for the time field. remove?
    e.preventDefault();
    console.log("handleSubmit")
    handleBlur();
  }

  function handleBlur(){
    let targetTask = {...task};
    let taskListCopy = [...taskList];

    // Update startTime and isPinnedStartTime on copy
    targetTask.startTime = startTime;
    targetTask.isPinnedStartTime = true;

    // If the task directly following the edited task is active and not pinned, we will pin it so that its time doesn't change
    if (index + 1 < taskListCopy.length){
      const nextTask = taskListCopy[index+1]
      if (!nextTask.isPinnedStartTime){
        const isActiveTask = toDateObject(nextTask.taskDate,nextTask.startTime) < new Date() && addMinutes(toDateObject(nextTask.taskDate,nextTask.startTime), nextTask.durationOfTask) > new Date();
        const isActiveBreak = addMinutes(toDateObject(nextTask.taskDate,nextTask.startTime), nextTask.durationOfTask) < new Date() && addMinutes(toDateObject(nextTask.taskDate,nextTask.startTime), nextTask.durationOfTask+nextTask.durationOfBreak) > new Date();
        if (isActiveTask || isActiveBreak){
          nextTask.isPinnedStartTime = true;
          // * Now save updated targetTask to DB
          axios.patch(`http://localhost:8000/api/tasks/${nextTask._id}`, nextTask)
          .then(res => {})
          .catch(err => console.error(err));
        }
      }
    }

    // update taskList copy with updated task
    taskListCopy[index] = targetTask;

    //TODO: handle automatic unpausing
    // see notes in TaskDuration.jsx about this

    // sort taskList and then update context taskList
    setTaskList(SortTasks( taskListCopy ));

    // * Now save updated targetTask to DB
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => {})
    .catch(err => console.error(err));

  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control form-control-sm px-1"
          type="time"
          onBlur={handleBlur}
          onChange={handleChange}
          value={startTime}
        />
      </form>
    </>
  );
}

export default StartTime;
