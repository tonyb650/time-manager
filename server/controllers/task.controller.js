const Task = require("../models/task.model");


module.exports = {
    createTask : (req,res) => {
        Task.create(req.body)
        .then(newTask=> res.json(newTask))
        .catch(err => res.status(400).json(err))
    },
    
    getAllTasks : (req, res) =>  {
        Task.find({})
        .then(allTasks => res.json(allTasks))
        .catch(err => res.status(400).json(err))
    },
    
    getTaskById : (req,res) => {
        Task.findOne( {_id: req.params.id})
        .then(oneTask => res.json(oneTask))
        .catch(err => res.status(400).json(err))
    },

    getTaskByUserId : (req,res) => {
        Task.find( {userId: req.params.id})
        .then(usersTasks => res.json(usersTasks))
        .catch(err => res.status(400).json(err))
    },

    updateTask : (req,res) => {
        Task.findOneAndUpdate ({_id : req.params.id}, req.body, {new:true, runValidators:true})
        .then(updatedTask => res.json(updatedTask))
        .catch(err => res.status(400).json(err))
    },
    
    deleteTask : (req,res) => {
        Task.findOneAndDelete ({_id : req.params.id} )
        .then(result => res.json(result))
        .catch(err => console.log(err))
    },
    }