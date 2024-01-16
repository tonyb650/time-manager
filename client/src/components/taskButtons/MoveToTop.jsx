import React, { useContext } from 'react'
import chevron2up from "../../assets/img/chevron-double-up.svg";
import axios from 'axios';
import TaskListContext from '../../context/TaskListContext';
import SortTasks from '../../utils/SortTasks';
import { toDateObject, toTimeString } from '../../utils/formatDate';
import addMinutes from '../../utils/addMinutes';

function MoveToTop(props) {
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const { task, index } = props;

  const handleClick = () => {
    // TODO: I feel like there might be a better way than creating copies in these next 2 lines(?)
    let targetTask = {...task}
    let taskListCopy = [...taskList]

    if(index==0){                                                                             // If the target task is the first or the only task, nothing will happen (return null)
        console.log("this is already the first task");
        return null;
    }

    const priorEarliest = toDateObject(taskListCopy[0].taskDate, taskListCopy[0].startTime);  // Retrieve the start time for the task[0]
    // Subtract the durationOfTask and durationOfBreak from priorEarliest and this becomes our new startTime for the target task
    const newEarliest = addMinutes(priorEarliest,-(taskListCopy[index].durationOfTask+taskListCopy[index].durationOfBreak));
    // TODO: If newEarliest < midnight, then set to midnight and reschedule every task in the day.
    targetTask.startTime = toTimeString(newEarliest);
    targetTask.isPinnedStartTime = true;                                                      // Set isPinned to true (since this will be the new first task, it must be pinned)
    if (priorEarliest < new Date()){                                                          // If 'end time' (which is equal to 'priorEarliest') < current time THEN set isComplete to true AND set actualDuration to duration+break
      targetTask.actualTotalDuration = targetTask.durationOfTask + targetTask.durationOfBreak; 
    } else {
      targetTask.actualTotalDuration = null;                                                  // Maybe this is not necessary ?? This would mean that a task later in the day already had an actual time from a time that hasn't passed yet. Impossible situation, I think.
    }

    // *Save old first task to DB as unPinned*
    taskListCopy[0].isPinnedStartTime = false;
    axios.patch(`http://localhost:8000/api/tasks/${taskListCopy[0]._id}`, taskListCopy[0])
    .then(res => { 
      // console.log("Patched old earliest (remove pinned) in MoveToTop.jsx");
    })
    .catch(err => console.error(err));

    taskListCopy[index] = targetTask;                                                         // Update taskList with modified task
    setTaskList(SortTasks( taskListCopy ));                                                   // Sort taskList and update context

    // * Now save updated targetTask to DB*
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => { 
      // console.log("Patched targetTask successful in MoveToTop.jsx");
    })
    .catch(err => console.error(err));
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