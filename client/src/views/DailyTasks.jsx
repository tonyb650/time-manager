import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Task from "../components/Task";
import DatePicker from "../components/DatePicker";
import DisplayClock from "../components/DisplayClock";
import addMinutes from "../utils/addMinutes";
import TaskListContext from "../context/TaskListContext";
import SortTasks from "../utils/SortTasks";
import CantinaBand3 from "../assets/sound/CantinaBand3.wav";
import taskEndTime from "../utils/taskEndTime";

function DailyTasks(props) {
  // Initialize state
  const {taskList, setTaskList} = useContext(TaskListContext);
  const [currTime, setCurrTime] = useState();
  const [renderDate, setRenderDate] = useState(new Date()); // 'renderDate' is a Date object
  const [isPaused, setIsPaused] = useState(false);
  
  // ~*~*~ Load main content
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks")
      .then((res) => {
        console.log("Loaded all tasks from DB: ");
        console.log(res.data)
        // *~*~ Filter res.data (all tasks) down to only tasks with taskDate = renderDate
        // TODO: make sure that filter will work in all time zones
        let tasksForDay = res.data.filter(
          (element) =>
            new Date(element.taskDate).toLocaleDateString().substring(0, 10) ==
            renderDate.toLocaleDateString().substring(0, 10)
        );
        console.log(tasksForDay);
        setTaskList(SortTasks(tasksForDay));
      })
      .catch((err) => console.log(err));
  }, [renderDate]);

  useEffect(() => {
    // This useEffect triggers a re-render of the page when the value in currTime changes.
    // This will change styling for tasks in case there is 'currently active task or break.
    console.log("re-render on new minute coming from *currTime*")
    // We will also check here for transition to/from a new task and play a sound
    for(let i=0; i< taskList.length; i++){
      // * Play sound at beginning of task
      if(new Date(taskList[i].startTime) < new Date() && new Date(taskList[i].startTime) > addMinutes(new Date(),-.5) ){
        console.log("Time to start new task")
        new Audio(CantinaBand3).play();
      }
      // * Play sound at end of task
      if(addMinutes(new Date(taskList[i].startTime),taskList[i].durationOfTask) < new Date() && addMinutes(new Date(taskList[i].startTime),taskList[i].durationOfTask) > addMinutes(new Date(),-.5) ){
        console.log("Time to end task & start break")
        new Audio(CantinaBand3).play();
      }
      // * Mark as completed (set actualTotalTime) at the end of 
      if(taskEndTime(taskList[i]) < new Date() && taskEndTime(taskList[i]) > addMinutes(new Date(),-.5) ){
        console.log("Time to end task & end break")
        let targetTask = {...taskList[i]}
        targetTask.actualTotalDuration = targetTask.durationOfTask+targetTask.durationOfBreak;
        // Do we need to save this to the DB? Maybe not, because it will be updated on the next screen refresh anyway ?
        let taskListCopy = [...taskList]
        taskListCopy[i] = targetTask;
        setTaskList(taskListCopy)
      }
      
    }
    // Need a way to make sure that it doesn't keep adding minutes on re-render of DailyTasks
    // Loop through all tasks. Find current task and if isPaused == true then add 1 minute to  durationOfTask AND save to DB
    // And then cascade updating of start time through remaining tasks
    // And re-render immediately ?
    if(isPaused){
      // const activeTaskIndex = null;
      for(let i = 0; i < taskList.length; i++){
        const taskStartTimeObj = new Date(taskList[i].startTime)
        if(taskStartTimeObj < new Date() && addMinutes(taskStartTimeObj, taskList[i].durationOfTask) > new Date()){
          taskList[i].durationOfTask += 1
          // * Now save to DB with updated 'durationOfTask'
          axios
          .patch(
            `http://localhost:8000/api/tasks/${taskList[i]._id}`,
            taskList[i]
          )
          .then((res) => console.log("Add 1 minute to duration and save"))
          .catch((err) => console.error(err)); // throw here?
        }
      }
      setTaskList(SortTasks( taskList ))
    }
  },[currTime])

  return (
    <div className="container">
      <DisplayClock currTime={currTime} setCurrTime={setCurrTime} />
      <Link to="/tasks/add">Add Task</Link>
      <DatePicker setRenderDate={setRenderDate} />
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
  );
}

export default DailyTasks;

















// DOES THIS BUFFER HELP PROTECT?

