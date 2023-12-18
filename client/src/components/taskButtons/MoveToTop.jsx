import React from 'react'
import chevron2up from "../../assets/img/chevron-double-up.svg";
import axios from 'axios';

function MoveToTop(props) {
  const { task, index, taskList, setTaskList, needsUpdate, setNeedsUpdate } = props;

  const handleClick = (e) => {
    e.preventDefault();
    // *If the target task is the first or the only task, nothing will happen (return null)



    if(index==0){
        console.log("this is already the first task");
        return null;
    }
    // console.log("entered handleClick")
    // console.log("index: " + index)
    // console.log("taskList.length: " + taskList.length)
    // *The following will be applicable if this is the *LAST* task in the taskList
    if(index==taskList.length-1){
      // console.log("entered movetasks");
      // console.log("taskList.length: "+taskList.length);
      // console.log(taskList);
      // console.log(index);
      // console.log(taskList[0].startTimeScheduled)
      // *Retrieve the start time for the task at index=0
      const priorEarliest = new Date(taskList[0].startTimeScheduled).getTime();
      // console.log("priorEarliest "+priorEarliest)
      // *Subtract the durationOfTask and durationOfBreak from priorEarliest and this becomes our new scheduledStartTime for the target task
      const newEarliest = new Date(priorEarliest-taskList[index].durationOfTask*60*1000-taskList[index].durationOfBreak*60*1000);
      // console.log("New newEarliest "+newEarliest)
      //let srtTime = new Date(new Date(resultArr[resultArr.length-1].startTimeScheduled).getTime()+(resultArr[resultArr.length-1].durationOfTask*60*1000));
      //console.log("New srtTime "+srtTime)
      task.startTimeScheduled = newEarliest.toISOString();
      // taskList[taskIndex].startTimeScheduled = newEarliest
      // console.log("task")
      // console.log(task)
      const taskListCopy = [...taskList]
      taskListCopy[index] = task
      // console.log("taskListCopy:")
      // console.log(taskListCopy)

      // *Save task with changes to DB here
      axios.patch(`http://localhost:8000/api/tasks/${task._id}`, task)
      .then(res => {
        console.log("Patch successful");
        // console.log(res);
        // console.log(needsUpdate)
        setNeedsUpdate(!needsUpdate);
        setTaskList( taskListCopy )

      })
      .catch(err => console.error(err));
      


  //     axios.patch(`http://localhost:8000/api/player/${player._id}`, newStatusObj)
  //     .then(res => {
  //         // console.log(res.data);
  //         // Pretty sure this is not the best way to do this...
  //         const targetIndex = playersList.findIndex((element) => element._id == player._id)
  //         const tempPlayersList = [...playersList]
  //         tempPlayersList[targetIndex] = res.data
  //         setPlayersList(tempPlayersList)
  //     })
  //     .catch(err => console.log(err))
  // }

    } else  {
      console.log("NOT index==taskList.length-1")

    }

    // const resortedTaskList = moveTasks(taskList, e.target.value);
    // console.log("we're back");
    // console.log(resortedTaskList);

    // setTaskList(resortedTaskList);
  };

  return (
    <button
    className="btn btn-sm btn-secondary mt-1"
    onClick={(e) => {
      handleClick(e);
    }}
    value={task._id}
  >
    <img src={chevron2up} /> Top*
  </button>
  )
}

export default MoveToTop;