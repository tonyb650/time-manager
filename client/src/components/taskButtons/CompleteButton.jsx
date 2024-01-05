import React, { useContext, useState } from "react";
import TaskListContext from "../../context/TaskListContext";
import minutesDiff from "../../utils/minutesDiff";
import SortTasks from "../../utils/SortTasks";
import axios from "axios";

function CompleteButton(props) {
  const { task, index, setIsPaused } = props;
  const { taskList, setTaskList } = useContext(TaskListContext);

  const handleComplete = () => {
    // * Create working copies of task and taskList
    let targetTask = { ...task };
    let taskListCopy = [...taskList]

    // * Calculate number of minutes elapsed
    let elapsedMinutes = minutesDiff(new Date(targetTask.startTime ), new Date());

    // * Set actualTotalDuration for task ()
    targetTask.actualTotalDuration = elapsedMinutes;
    // * Handle situation where elapsedMinutes is fewer than durationOfBreak
    if (elapsedMinutes < targetTask.durationOfBreak) {
      targetTask.durationOfBreak = elapsedMinutes;
      targetTask.durationOfTask = 0;
    } else {
      targetTask.durationOfTask = elapsedMinutes - targetTask.durationOfBreak;
    }
    // * Update this task in DB
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => { 
      console.log("Patched task with non-null actualTotalDuration");
    })
    .catch(err => console.error(err));
    // * Update this task in taskList & re-sort
    taskListCopy[index] = targetTask;
    setTaskList(SortTasks( taskListCopy ));
    // * If we were paused, then unpause
    setIsPaused(false);
  };

  return (
    <div className="col-6 col-xs-12 col-sm-12 col-md-12 d-grid ">
      <button className="btn btn-success" onClick={handleComplete}>Complete Now</button>
    </div>
  );
}

export default CompleteButton;
