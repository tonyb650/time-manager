import React, { useContext } from 'react'
import chevron2up from "../../assets/img/chevron-double-up.svg";
import axios from 'axios';
import TaskListContext from '../../context/TaskListContext';
import SortTasks from '../../utils/SortTasks';

function MoveToTop(props) {
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const { task, index } = props;

  const handleClick = () => {
    // TODO: I feel like there might be a better way than creating copies in these next 2 lines(?)
    let targetTask = {...task}
    let taskListCopy = [...taskList]

    // *If the target task is the first or the only task, nothing will happen (return null)
    if(index==0){
        console.log("this is already the first task");
        return null;
    }

    // *Retrieve the start time for the task at index=0
    const priorEarliest = new Date(taskListCopy[0].startTime).getTime();
    // *Subtract the durationOfTask and durationOfBreak from priorEarliest and this becomes our new startTime for the target task
    const newEarliest = new Date(priorEarliest-taskListCopy[index].durationOfTask*60*1000-taskListCopy[index].durationOfBreak*60*1000);
    // TODO: If newEarliest < midnight, then set to midnight and reschedule every task in the day.
    targetTask.startTime = newEarliest.toISOString();
    // * Set isPinned to true (since this will be the new first task, it must be pinned)
    targetTask.isPinnedStartTime = true;
    // * If 'end time' (which is equal to 'priorEarliest') < current time THEN set isComplete to true AND set actualDuration to duration+break
    if (priorEarliest < new Date()){
      // targetTask.isComplete = true;
      targetTask.actualTotalDuration = targetTask.durationOfTask + targetTask.durationOfBreak; // TODO: May need to revisit this when I figure out how actualDuration is going to work
    } else {
      targetTask.actualTotalDuration = null; // Maybe this is not necessary ?? This would mean that a task later in the day already had an actual time from a time that hasn't passed yet. Impossible situation, I think.
    }

    // * Save old first task to DB as unPinned
    taskListCopy[0].isPinnedStartTime = false;
    axios.patch(`http://localhost:8000/api/tasks/${taskListCopy[0]._id}`, taskListCopy[0])
    .then(res => { 
      console.log("Patched old earliest (remove pinned)");
    })
    .catch(err => console.error(err));

    // * Update context
    taskListCopy[index] = targetTask;
    setTaskList(SortTasks( taskListCopy ));

    // * Now save updated targetTask to DB
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => { 
      console.log("Patched targetTask successful");
      console.log(taskListCopy)
    })
    .catch(err => console.error(err));
  }

  return (
    <button
      className="btn btn-sm btn-light my-1"
      onClick={handleClick}
      value={task._id}
    >
    <img src={chevron2up} /> Top
  </button>
  )
}

export default MoveToTop;