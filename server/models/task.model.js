const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskTitle: {
        type: String,
        required: [ true, "Task title is required"]
    },
    taskBody: {
        type: String
    },
    durationOfTask: {type: Number,
        required: [true, "Task duration is required"]
    },
    durationOfBreak: {type: Number,
        required: [true, "Break duration is required"]
    },
    parentId: {type: String
    },
    startTimeScheduled: {type: Date
    },
    startTimeActual: {type: Date
    },
    taskDate: {type: Date,
        required: [true, "Task date is required"]
    },
    isComplete: {type: Boolean
    }

}, {timestamps: true})

module.exports = mongoose.model('Task', taskSchema)