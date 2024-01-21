import React, { useContext } from "react";
import trashcan from "../../assets/img/trash-fill.svg";
import TaskListContext from "../../context/TaskListContext";
import axios from "axios";
import SortTasks from "../../utils/SortTasks";

function DeleteButton(props) {
  const { taskId } = props;
  const { taskList, setTaskList}  = useContext(TaskListContext);

  const handleClick = () => {
    window.confirm("add modal here")
    //https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm

    axios.delete(`http://localhost:8000/api/tasks/${taskId}`, { withCredentials : true})
    .then(res => { 
      console.log("Successfully deleted.")
      let filteredArr = taskList.filter((task) =>  task._id != taskId)
      setTaskList(SortTasks(filteredArr))
    })
    .catch(err => console.error(err));
  };

  return (
    <>
      <img src={trashcan} className="border rounded mx-1 p-1" onClick={handleClick}/>
    </>
  );
}

export default DeleteButton;
