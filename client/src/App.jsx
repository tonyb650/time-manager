import { BrowserRouter, Routes, Route } from "react-router-dom";
import DailyTasks from './views/DailyTasks';
import AddTask from './views/AddTask';
import EditTask from './views/EditTask';
import TaskListProvider from './context/TaskListProvider';


function App() {
  return (
    <TaskListProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<DailyTasks/>} />
          <Route path="tasks/add" element={<AddTask/>} />
          <Route path="/tasks/edit/:id" element={<EditTask/>} />
        </Routes>
      </BrowserRouter>
    </TaskListProvider>
  )
}

export default App;
