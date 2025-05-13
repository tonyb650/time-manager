import React, { useContext } from "react";
import chevron2down from "../../assets/img/chevron-double-down.svg";
import TaskListContext from "../../context/TaskListContext";
import SortTasks from "../../utils/SortTasks";
import taskEndTime from "../../utils/taskEndTime";
import { toTimeString } from "../../utils/formatDate";
import patchTask from "../../utils/patchTask";

function MoveToBottom(props) {
  const { taskList, setTaskList } = useContext(TaskListContext);
  const { task, index } = props;


  const handleClick = () => {
    if (index == taskList.length - 1) {                                                     // If the target task is the last or the only task, nothing will happen (return null)
      console.log("this is already the last task");
      return null;
    }
    // TODO: I feel like there might be a better way than creating these working copies in these next 2 lines(?)
    let targetTask = { ...task };
    let taskListCopy = [...taskList]

    const priorEndTime = taskEndTime(taskListCopy[taskListCopy.length-1])                   // The prior ending time for the prior final task becomes the startTime for the target task
    // TODO: If newEarliest < midnight, confirm that I'm handling startTime correctly.
    targetTask.startTime = toTimeString(priorEndTime);                  
    
    targetTask.isPinnedStartTime = false;                                                   // By moving to the bottom, we are 'unpinning' this task
    /* Next, handle the task that *was* following this task */
    if(!taskListCopy[index+1].isPinnedStartTime){                                           // If the old 'following' task is not already 'pinned' 
      taskListCopy[index+1].isPinnedStartTime = true;                                       // Then set PinnedStartTime = true
      patchTask(taskListCopy[index+1], false, "Patched old following task (now pinned) in MoveToBottom.jsx")   // Update this task in DB
    }
    patchTask(targetTask, false, "Patched targetTask successful in MoveToBottom.jsx")       // Update this task in DB
    taskListCopy[index] = targetTask;                                                       // Update taskList with modified task
    setTaskList(SortTasks( taskListCopy ));                                                 // Sort and update taskList (in context)
  }

  return (
    <button
      className="btn btn-sm btn-light mb-1"
      onClick={handleClick}
      value={task._id}
    >
      <img src={chevron2down} /> Btm
    </button>
  );
}

export default MoveToBottom;
