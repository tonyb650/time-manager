import { useContext } from "react";
import chevron1down from "../../assets/img/chevron-down.svg";
import SortTasks from "../../utils/SortTasks";
import { toTimeString } from "../../utils/formatDate";
import patchTask from "../../utils/patchTask";
import taskEndTime from "../../utils/taskEndTime";
import TaskListContext from "../../context/TaskListContext";

function MoveDown(props) {
  const { task, index } = props;
  const { taskList, setTaskList } = useContext(TaskListContext);

  function handleClick(){
    if (index == taskList.length - 1) {                             // If the target task is the last or the only task, nothing will happen (return null)
      console.log("this is already the last task");
      return null;
    }
    
    let targetTask = { ...task };
    let taskListCopy = [...taskList]

    if( taskListCopy[index+1].isPinnedStartTime ){
      targetTask.startTime = toTimeString(taskEndTime(taskListCopy[index + 1]));  // Set targetTask.startTime to "following".endTime
    } else {
      if( targetTask.isPinnedStartTime){
        taskListCopy[index + 1].isPinnedStartTime = true;
      } else {
        taskListCopy[index + 1].startTime = toTimeString(taskEndTime(targetTask));
      }
      targetTask.startTime = toTimeString(taskEndTime(taskListCopy[index + 1]));  // Set targetTask.startTime to "following".endTime
      patchTask(taskListCopy[index+1], false, "Patched old following task in MoveDown.jsx")   // Update this task in DB

    }
    targetTask.isPinnedStartTime = false;
    patchTask(targetTask, false, "Patched targetTask successful in MoveDown.jsx")       // Update this task in DB
    taskListCopy[index] = targetTask;                                                       // Update taskList with modified task
    setTaskList(SortTasks( taskListCopy ));   
  }

  return (
    <button
      className="btn btn-sm btn-light mb-1"
      onClick={handleClick}
      value={task._id}
    >
    <img src={chevron1down} /> Down
  </button>
  )
}

export default MoveDown;