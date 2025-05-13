import { useContext } from "react";
import chevron1up from "../../assets/img/chevron-up.svg";
import TaskListContext from "../../context/TaskListContext";
import taskEndTime from "../../utils/taskEndTime";
import addMinutes from "../../utils/addMinutes";
import patchTask from "../../utils/patchTask";
import SortTasks from "../../utils/SortTasks";
import { toDateObject, toTimeString } from "../../utils/formatDate";

function MoveUp(props) {
  const { task, index } = props;
  const { taskList, setTaskList } = useContext(TaskListContext);

  function handleClick(){
    if(index==0){                                                                             // If the target task is the first or the only task, nothing will happen (return null)
      console.log("this is already the first task");
      return null;
    }
    let targetTask = {...task}                                      // Working copy of current task
    let taskListCopy = [...taskList]                                // Working copy of taskList
    
    // This next conditional handles case where current task is pinned but following task is not. Here we want to pin following task so it's start time doesn't change
    if(taskListCopy.length > index + 1 && targetTask.isPinnedStartTime == true && taskListCopy[index+1].isPinnedStartTime == false ){
      taskListCopy[index+1].isPinnedStartTime = true;
      patchTask(taskListCopy[index+1], false, "Patched following task successful in MoveUp.jsx" )
    }
    if( taskListCopy[index-1].isPinnedStartTime === true){          // Handle case where the task before this one is pinned
      targetTask.isPinnedStartTime = true;                          // In this case, the current task will need to be pinned
      let priorStartTime = toDateObject(taskListCopy[index-1].taskDate, taskListCopy[index-1].startTime)
      let idealStartTime = addMinutes(priorStartTime,-(targetTask.durationOfTask+targetTask.durationOfBreak))
      let midnight = toDateObject(targetTask.taskDate,"00:00");
      let prevPrevEndTime = new Date(Math.max(idealStartTime, midnight));
      if( index > 1){                                               // If there is task before the previous one (previous to the previous), we need to check for time conflict 
        prevPrevEndTime = taskEndTime(taskListCopy[index-2]);       // Find out the endTime of the 'previous previous'
      }
      targetTask.startTime = toTimeString(new Date(Math.max(idealStartTime, prevPrevEndTime)));  // Set startTime to the later of the two possibilities
      taskListCopy[index-1].isPinnedStartTime = false               // Unpin 'previous'
    } else {                                                        // Handle case where the task before is not pinned (it must have a 'parent')
      targetTask.isPinnedStartTime = false;                         // Unpin current
      targetTask.startTime = taskListCopy[index-1].startTime;       // Set current start time to prevStartTime
    }
    taskListCopy[index-1].startTime = toTimeString(taskEndTime(targetTask));      // Set prev.startTime to curr.endTime (swapping places essentially)
    patchTask(taskListCopy[index-1],false,"Patched previous task successful in MoveUp.jsx");
    patchTask(targetTask,false,"Patched targetTask successful in MoveUp.jsx");
    taskListCopy[index] = targetTask;
    setTaskList(SortTasks(taskListCopy));
  }

  return (
    <button
      className="btn btn-sm btn-light mb-1"
      onClick={handleClick}
      value={task._id}
    >
    <img src={chevron1up} /> Up
  </button>
  )
}

export default MoveUp;