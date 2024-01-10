const mongoose = require('mongoose');

// startTime is dynamic unless isPinnedStartTime == true
// TBD:  it may still be dynamic if forced by real time pause/resume controls
// durationOfTask is the originally scheduled task duration
// durationOfBreak is the originally scheduled break
// actualTotalDuration is the duration (task+break) based on pause/resume AND isComplete controls
// isPinnedStartTime == true means that the startTime will not be dynamic
// isPinnedStartTime == false means that the startTime will be calculated based on the end time of the prev task
// taskDate will be the date that the  task belongs to. Note that this is separate from startTime because a day's tasklist could go past midnight
// TODO: will taskDate be midnight local time or Zulu time ?
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
    startTime: {type: Date
    },
    taskDate: {type: Date,
        required: [true, "Task date is required"]
    },
    isPinnedStartTime: {type: Boolean
    }
}, {timestamps: true})

module.exports = mongoose.model('Task', taskSchema)