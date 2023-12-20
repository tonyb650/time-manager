import React, { useContext } from 'react'
import chevron2up from "../../assets/img/chevron-double-up.svg";
import axios from 'axios';
import TaskListContext from '../../context/TaskListContext';
import SortTasks from '../../utils/SortTasks';

function MoveToTop(props) {
  const { taskList, setTaskList}  = useContext(TaskListContext);
  const { task, index } = props;

  const handleClick = (e) => {
    e.preventDefault();
    // TODO: I feel like there might be a better way than creating copies in these next 2 lines(?)
    let targetTask = {...task}
    let taskListCopy = [...taskList]

    // *If the target task is the first or the only task, nothing will happen (return null)
    if(index==0){
        console.log("this is already the first task");
        return null;
    }
    // *Look for a child of the target task, and if found, set child's parentId to target task.parentId (which may be null)
    for(let i=0; i<taskListCopy.length;i++){
      if(taskListCopy[i].parentId == targetTask._id){
        taskListCopy[i].parentId = targetTask.parentId;
        // * Now save 'child' task to DB with updated 'parentId'
        axios.patch(`http://localhost:8000/api/tasks/${taskListCopy[i]._id}`, taskListCopy[i])
        .then(res => { 
          console.log("Patch successful");
        })
        .catch(err => console.error(err));
      }
    }
    // *Set target parentId to null (since top task can have no parent)
    targetTask.parentId = null;
    // *Retrieve the start time for the task at index=0
    const priorEarliest = new Date(taskListCopy[0].startTimeScheduled).getTime();
    // *Subtract the durationOfTask and durationOfBreak from priorEarliest and this becomes our new scheduledStartTime for the target task
    const newEarliest = new Date(priorEarliest-taskListCopy[index].durationOfTask*60*1000-taskListCopy[index].durationOfBreak*60*1000);
    // TODO: If newEarliest < midnight, then set to midnight and reschedule every task in the day.
    targetTask.startTimeScheduled = newEarliest.toISOString();
    taskListCopy[index] = targetTask;
    setTaskList(SortTasks( taskListCopy ));

    // * Now save updated targetTask to DB
    axios.patch(`http://localhost:8000/api/tasks/${targetTask._id}`, targetTask)
    .then(res => { 
      console.log("Patch successful");
      console.log("taskListCopy after .then")
      console.log(taskListCopy)
    })
    .catch(err => console.error(err));

  }

  return (
    <button
      className="btn btn-sm btn-light my-1"
      onClick={(e) => {handleClick(e)}}
      value={task._id}
    >
    <img src={chevron2up} /> Top*
  </button>
  )
}

export default MoveToTop;