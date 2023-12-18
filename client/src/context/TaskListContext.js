import {createContext} from 'react';
const TaskListContext = createContext({taskList : [], setTaskList : (() => {})});
export default TaskListContext;