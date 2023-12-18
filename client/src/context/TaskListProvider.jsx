import { useState } from "react";
import TaskListContext from "./TaskListContext";

function TaskListProvider(props) {
    const [ taskList, setTaskList ] = useState([]);

    return (
        <TaskListContext.Provider value ={{taskList,setTaskList}}>
            {props.children}
        </TaskListContext.Provider>
    )

}

export default TaskListProvider;