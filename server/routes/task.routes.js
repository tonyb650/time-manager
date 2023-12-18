const TaskController = require("../controllers/task.controller");

module.exports = app => {
    app.get("/api/tasks", TaskController.getAllTasks);
    app.get('/api/tasks/:id', TaskController.getTaskById);
    app.post('/api/tasks', TaskController.createTask);
    app.patch('/api/tasks/:id', TaskController.updateTask);
    app.delete('/api/tasks/:id', TaskController.deleteTask);
}