import { BrowserRouter, Routes, Route } from "react-router-dom";
import DailyTasks from './views/DailyTasks';
import AddTask from './views/AddTask';
import EditTask from './views/EditTask';
import TaskListProvider from './context/TaskListProvider';
import LoginPage from "./views/LoginPage";
import RenderDateProvider from "./context/RenderDateProvider";

function App() {
  return (
    <RenderDateProvider>
      <TaskListProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<LoginPage/>} />
            <Route exact path="tasks" element={<DailyTasks/>} />
            <Route exact path="tasks/add" element={<AddTask/>} />
            <Route path="tasks/edit/:id" element={<EditTask/>} />
          </Routes>
        </BrowserRouter>
      </TaskListProvider>
    </RenderDateProvider>
  )
}

export default App;
