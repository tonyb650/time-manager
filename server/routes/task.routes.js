const TaskController = require("../controllers/task.controller");
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
    app.get("/api/tasks", authenticate, TaskController.getAllTasks);
    app.get('/api/tasks/:id', TaskController.getTaskById);
    app.post('/api/tasks', TaskController.createTask);
    app.patch('/api/tasks/:id', TaskController.updateTask);
    app.delete('/api/tasks/:id', TaskController.deleteTask);
}