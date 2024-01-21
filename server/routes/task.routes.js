const TaskController = require("../controllers/task.controller");
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
    app.get("/api/tasks", authenticate, TaskController.getAllTasks);
    app.get('/api/tasks/:id', authenticate, TaskController.getTaskById);
    app.get('/api/tasks/users/:id', authenticate, TaskController.getTaskByUserId);
    app.post('/api/tasks', authenticate, TaskController.createTask);
    app.patch('/api/tasks/:id', authenticate, TaskController.updateTask);
    app.delete('/api/tasks/:id', authenticate, TaskController.deleteTask);
}