import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Task from "../components/Task";
import DatePicker from "../components/DatePicker";
import DisplayClock from "../components/DisplayClock";
import addMinutes from "../utils/addMinutes";
import TaskListContext from "../context/TaskListContext";
import SortTasks from "../utils/SortTasks";


function DailyTasks(props) {
  // Initialize state
  const {taskList, setTaskList} = useContext(TaskListContext);
  const [currTime, setCurrTime] = useState();
  const [renderDate, setRenderDate] = useState(new Date()); // 'renderDate' is a Date object

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
        setTaskList(SortTasks(tasksForDay));
      })
      .catch((err) => console.log(err));
  }, [renderDate]);

  useEffect(() => {
    console.log("re-render on new minute coming from *currTime*")
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
            />
          </div>
        );
      })}
    </div>
  );
}

export default DailyTasks;

















// DOES THIS BUFFER HELP PROTECT?

