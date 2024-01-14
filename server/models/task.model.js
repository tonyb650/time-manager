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
    actualTotalDuration: {type: Number,
    }, 
    startTime: {type: String,
      required: [true, "Start time is required"]
    },
    taskDate: {type: String,
        required: [true, "Task date is required"]
    },
    isPinnedStartTime: {type: Boolean
    },
    userId: {type: String,
      required: [true, "UserID is required"]
    },
}, {timestamps: true})

module.exports = mongoose.model('Task', taskSchema)