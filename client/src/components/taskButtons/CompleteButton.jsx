import React, { useContext, useState } from "react";
import TaskListContext from "../../context/TaskListContext";
import minutesDiff from "../../utils/minutesDiff";
import SortTasks from "../../utils/SortTasks";
import axios from "axios";
import { toDateObject } from "../../utils/formatDate";
import patchTask from "../../utils/patchTask";

function CompleteButton(props) {
  const { task, index, setIsPaused } = props;
  const { taskList, setTaskList } = useContext(TaskListContext);

  const handleComplete = () => {
    // * Create working copies of task and taskList
    let targetTask = { ...task };
    let taskListCopy = [...taskList]

    let elapsedMinutes = minutesDiff(toDateObject(targetTask.taskDate,targetTask.startTime), new Date()); // Calculate number of minutes elapsed
    targetTask.actualTotalDuration = elapsedMinutes;                                                      // Set actualTotalDuration for task
    if (elapsedMinutes < targetTask.durationOfBreak) {                                                    // Handle situation where elapsedMinutes is fewer than durationOfBreak
      targetTask.durationOfBreak = elapsedMinutes;
      targetTask.durationOfTask = 0;
    } else {
      targetTask.durationOfTask = elapsedMinutes - targetTask.durationOfBreak;
    }

    patchTask(targetTask, false, "Patched task with non-null actualTotalDuration in CompleteButton.jsx")   // Update this task in DB
    taskListCopy[index] = targetTask;                                                                     // Update this task in taskList 
    setTaskList(SortTasks( taskListCopy ));                                                               // Sort taskList and update
    setIsPaused(false);                                                                                   // If we were paused, then unpause
  };

  return (
    <div className="col-6 col-xs-12 col-sm-12 col-md-12 d-grid my-1">
      <button className="btn btn-info" onClick={handleComplete}>Complete Now</button>
    </div>
  );
}

export default CompleteButton;
