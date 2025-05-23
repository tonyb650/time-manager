import { useContext, useEffect, useState } from "react";
import TaskListContext from "../../context/TaskListContext";
import SortTasks from "../../utils/SortTasks";
import { toDateObject } from "../../utils/formatDate";
import addMinutes from "../../utils/addMinutes";
import patchTask from "../../utils/patchTask";

function StartTime(props) {
  const { task, index } = props;
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const [startTime, setStartTime] = useState(task.startTime);

  // TODO: I'm questioning if there is a problem with using useEffect to re-render on props but it is working so I'll live with it for now
  // Note: without this useEffect, value={duration} lags behind on each re-render of the page
  // More reading: https://tkdodo.eu/blog/putting-props-to-use-state 
  useEffect(()=>{
    setStartTime(task.startTime);
  },[task, taskList])

  function handleChange(e){
    setStartTime(e.target.value);
  }

  function handleSubmit(e) {        // TODO: this handler may not be necessary for the time field. Double-check that and remove
    e.preventDefault();
    console.log("handleSubmit")
    handleBlur();
  }

  function handleBlur(){
    let targetTask = {...task};                         // Make working copies of task and taskList
    let taskListCopy = [...taskList];
    targetTask.startTime = startTime;                   // Update startTime and isPinnedStartTime on copy
    targetTask.isPinnedStartTime = true;

    // *If the task directly following the edited task is active and not pinned, we will pin it so that its time doesn't change*
    if (index + 1 < taskListCopy.length){
      const nextTask = taskListCopy[index+1]
      if (!nextTask.isPinnedStartTime){
        const isActiveTask = toDateObject(nextTask.taskDate,nextTask.startTime) < new Date() && addMinutes(toDateObject(nextTask.taskDate,nextTask.startTime), nextTask.durationOfTask) > new Date();
        const isActiveBreak = addMinutes(toDateObject(nextTask.taskDate,nextTask.startTime), nextTask.durationOfTask) < new Date() && addMinutes(toDateObject(nextTask.taskDate,nextTask.startTime), nextTask.durationOfTask+nextTask.durationOfBreak) > new Date();
        if (isActiveTask || isActiveBreak){
          nextTask.isPinnedStartTime = true;
          taskListCopy[index+1] = nextTask;             // This line is not technically necessary because it will be handled when the taskList is sorted
          patchTask(nextTask, false, "Patched task following targetTask (pinned) successful in StartTime.jsx")       // Update this task in DB
        }
      }
    }
    taskListCopy[index] = targetTask;                   // update taskList copy with updated task
    
    //TODO: possibly handle automatic unpausing, see notes in TaskDuration.jsx about this
    
    patchTask(targetTask, false, "Patched targetTask successful in StartTime.jsx")       // Update this task in DB
    setTaskList(SortTasks( taskListCopy ));             // sort taskList and then update context taskList
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
