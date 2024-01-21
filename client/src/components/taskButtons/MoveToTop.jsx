import React, { useContext } from 'react'
import chevron2up from "../../assets/img/chevron-double-up.svg";
import TaskListContext from '../../context/TaskListContext';
import SortTasks from '../../utils/SortTasks';
import { toDateObject, toTimeString } from '../../utils/formatDate';
import addMinutes from '../../utils/addMinutes';
import patchTask from '../../utils/patchTask';

function MoveToTop(props) {
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const { task, index } = props;

  const handleClick = () => {
    if(index==0){                                                                             // If the target task is the first or the only task, nothing will happen (return null)
        console.log("this is already the first task");
        return null;
    }

    // TODO: I feel like there might be a better way than creating copies in these next 2 lines(?)
    let targetTask = {...task}
    let taskListCopy = [...taskList]

    const priorEarliest = toDateObject(taskListCopy[0].taskDate, taskListCopy[0].startTime);  // Retrieve the start time for the task[0]
    // Subtract the durationOfTask and durationOfBreak from priorEarliest and this becomes our new startTime for the target task
    let newEarliest = addMinutes(priorEarliest,-(targetTask.durationOfTask+targetTask.durationOfBreak));
    const midnight = toDateObject(targetTask.taskDate,"00:00");
    newEarliest = new Date(Math.max(newEarliest, midnight));                                  // New earliest cannot be earlier than midnight
    targetTask.startTime = toTimeString(newEarliest);
    targetTask.isPinnedStartTime = true;                                                      // Set isPinned to true (since this will be the new first task, it must be pinned)
    // TODO: remove following block after full debugging
    /* I THINK THIS NEXT IF/ELSE BLOCK IS HANDLED BY SortTasks */
    // if (priorEarliest < new Date()){                                                          // If 'end time' (which is equal to 'priorEarliest') < current time THEN set isComplete to true AND set actualDuration to duration+break
    //   targetTask.actualTotalDuration = targetTask.durationOfTask + targetTask.durationOfBreak; 
    // } else {
    //   targetTask.actualTotalDuration = null;                                                  // Maybe this is not necessary ?? This would mean that a task later in the day already had an actual time from a time that hasn't passed yet. Impossible situation, I think.
    // }

    taskListCopy[0].isPinnedStartTime = false;                                                // Change old first task to unPinned
    if(taskListCopy[0].startTime=="00:00"){                                                   // Handle case where old first task started at midnight, set time to 12:01 AM so that it will sort correctly
      taskListCopy[0].startTime = "00:01";
    }
    patchTask(taskListCopy[0], false, "Patched old earliest (remove pinned) in MoveToTop.jsx")// Update this task in DB
    patchTask(targetTask, false, "Patched targetTask successful in MoveToTop.jsx")            // Update this task in DB
    taskListCopy[index] = targetTask;                                                         // Update taskList with modified task
    setTaskList(SortTasks( taskListCopy ));                                                   // Sort taskList and update context
  }

  return (
    <button
      className="btn btn-sm btn-light mb-1"
      onClick={handleClick}
      value={task._id}
    >
    <img src={chevron2up} /> Top
  </button>
  )
}

export default MoveToTop;