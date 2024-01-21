import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Task from "../components/Task";
import addMinutes from "../utils/addMinutes";
import TaskListContext from "../context/TaskListContext";
import SortTasks from "../utils/SortTasks";
import CantinaBand3 from "../assets/sound/CantinaBand3.wav";
import taskEndTime from "../utils/taskEndTime";
import NavBar from "../components/NavBar";
import { toDateObject, toISODateString } from "../utils/formatDate";
import patchTask from "../utils/patchTask";
import RenderDateContext from "../context/RenderDateContext";

function DailyTasks(props) {
  /* Initialize state & context */
  const {taskList, setTaskList} = useContext(TaskListContext);
  const {renderDate, setRenderDate} = useContext(RenderDateContext);
  const [currTime, setCurrTime] = useState();
  // const [renderDate, setRenderDate] = useState(new Date()); // 'renderDate' is a Date object
  const [isPaused, setIsPaused] = useState(false);
  const userId = sessionStorage.getItem('userId');
  
  /* Load Main Content any time date (renderDate) is changed */
  useEffect(() => {
    setIsPaused(false);                                     // Unpause whenever we change date
    axios
      .get(`http://localhost:8000/api/tasks/users/${userId}`, { withCredentials : true })
      .then((res) => {
        // TODO: make sure that filter will work in all time zones
        const userId = sessionStorage.getItem('userId')
        let tasksForDay = res.data.filter((element) => element.taskDate == toISODateString(renderDate) && element.userId == userId);  // Filter res.data (all tasks) down to only tasks with taskDate == renderDate
        setTaskList(SortTasks(tasksForDay));
      })
      .catch((err) => console.log(err));
  }, [renderDate]);

  /* This next useEffect triggers a re-render of the page when the value in currTime changes.
  This will change styling for tasks in case there is 'currently active task or break.*/
  useEffect(() => {
    console.log("re-render on new minute coming from *currTime*")
    /* We will also check here for transition to/from a new task and play a sound */
    for(let i=0; i< taskList.length; i++){
      const task = taskList[i]
      // * Play sound at beginning of task
      if(toDateObject(task.taskDate,task.startTime) < new Date() && toDateObject(task.taskDate,task.startTime) > addMinutes(new Date(),-.5) ){
        // console.log("Time to start new task")
        new Audio(CantinaBand3).play();
      }
      // * Play sound at end of task
      if(addMinutes(toDateObject(task.taskDate,task.startTime),task.durationOfTask) < new Date() && addMinutes(toDateObject(task.taskDate,task.startTime),task.durationOfTask) > addMinutes(new Date(),-.5) ){
        // console.log("Time to end task & start break")
        new Audio(CantinaBand3).play();
      }
      // * Mark as completed (set actualTotalTime) at the end of 
      if(taskEndTime(task) < new Date() && taskEndTime(task) > addMinutes(new Date(),-.5) ){
        // console.log("Time to end task & end break")
        let targetTask = {...taskList[i]}
        targetTask.actualTotalDuration = targetTask.durationOfTask+targetTask.durationOfBreak;
        // TODO: Do we need to save this to the DB? Maybe not, because it will be updated on the next screen refresh anyway ?
        let taskListCopy = [...taskList]
        taskListCopy[i] = targetTask;
        setTaskList(taskListCopy)
      }
      
    }
    // TODO: Might need a way to make sure that it doesn't keep adding minutes on re-render of DailyTasks?
    /* When currTime increments, we also want to check if isPaused == true.
      If it is, we loop through all the tasks to see if one is currently active.
      If there is one, then add 1 minute to durationOfTask AND save to DB.
      That will also require that the tasks that follow have startTime updated, 
      which should be handled by the SortTasks function. */
    if(isPaused){
      let thereIsAnActiveTask = false;
      for(let i = 0; i < taskList.length; i++){
        const taskStartTimeObj = toDateObject(taskList[i].taskDate,taskList[i].startTime)
        if(taskStartTimeObj < new Date() && addMinutes(taskStartTimeObj, taskList[i].durationOfTask) > new Date()){ // Test to see if this is the currently active task
          thereIsAnActiveTask = true;
          taskList[i].durationOfTask += 1                           // if it is currently active task, then increase duration by one minute
          patchTask(taskList[i], true, "Add 1 minute to duration and save")   // Update this task in DB
        }
      }
      if(!thereIsAnActiveTask){ 
        console.log("unpausing on rerender of currTime ")
        setIsPaused(false);                                         // There is no active task, so we should not be paused
      }
      setTaskList(SortTasks( taskList ))                            // Calling 'SortTasks' will cascade changes throughout today's tasks
    }
  },[currTime])

  return (
    <>
      <NavBar currTime={currTime} setCurrTime={setCurrTime} />
      <div className="container">
        {taskList.map((task, index) => {
          return (
            <div key={index}>
              <Task
                task={task}
                index={index}
                currTime={currTime}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DailyTasks;

















// DOES THIS BUFFER HELP PROTECT?

