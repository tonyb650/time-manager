import { Link } from "react-router-dom";

import pushpin from "../assets/img/pin-angle-fill.svg";
import editpencil from "../assets/img/pencil-fill.svg";
import { toDateObject } from "../utils/formatDate";
import addMinutes from "../utils/addMinutes";

import PauseResume from "./taskButtons/PauseResume";
import DeleteButton from "./taskButtons/DeleteButton";
import CompleteButton from "./taskButtons/CompleteButton";
import TaskDuration from "./taskFields/TaskDuration";
import MoveToTop from "./taskButtons/MoveToTop";
import MoveUp from "./taskButtons/MoveUp";
import MoveDown from "./taskButtons/MoveDown";
import MoveToBottom from "./taskButtons/MoveToBottom";

import StartTime from "./taskFields/StartTime";
import EndTime from "./taskFields/EndTime";

function Task(props) {
  const { task, index, isPaused, setIsPaused } = props;

  // * Determine 'isActiveTask' for rendering/styling purposes
  const isActiveTask = toDateObject(task.taskDate,task.startTime) < new Date() && addMinutes(toDateObject(task.taskDate,task.startTime), task.durationOfTask) > new Date();

  // * Determine 'isActiveBreak' for rendering/styling purposes
  const isActiveBreak = addMinutes(toDateObject(task.taskDate,task.startTime), task.durationOfTask) < new Date() && addMinutes(toDateObject(task.taskDate,task.startTime), task.durationOfTask+task.durationOfBreak) > new Date();
  
  return (
    <>
      <div className={"container border rounded my-2 pt-1 "+( isActiveTask ? isPaused ? "border-warning border-3":"border-info border-3" : "")}>
        <div className="row">
          <div className="col-12 col-xs-4 col-sm-4 col-lg-2">
            <div className="container">
              <div className="row py-1 gap-0 row-gap-1">
                <div className="col-4 col-sm-12">
                  <StartTime task={task} index={index}/>
                </div>
                <div className="col-4 col-sm-12 ">
                    <TaskDuration task={task} index={index}/>
                </div>
                <div className="col-4 col-sm-12 ">
                  <EndTime task={task}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-8 col-sm-5 col-lg-6">
            <div className="row">
              <div className="col d-flex justify-content-between">
                <h3 >
                {task.isPinnedStartTime ? (
                  <span><img src={pushpin} />  </span>
                ) : null}
                  <Link className="text-white text-decoration-none" to={`/tasks/edit/${task._id}`}>
                    {task.taskTitle}
                  </Link>
                </h3>
                <span>
                  <Link to={`/tasks/edit/${task._id}`}>
                    <img src={editpencil} className="border rounded mx-1 p-1"/>
                  </Link>
                  <DeleteButton taskId = {task._id}/>
                </span>

              </div>
            </div>
            
            <div className="form-text">{task.taskBody}</div>
            {/* <div className="form-text text-black-50">Idx:{index} | TotalDuration:{task.actualTotalDuration}</div> */}
          </div>
          <div className="col-12 col-xs-12 col-sm-3 col-lg-2">
            <div className="container">
              <div className="row">
                { isActiveTask ?
                <PauseResume
                  task={task}
                  index={index}
                  isPaused={isPaused}
                  setIsPaused={setIsPaused}
                  isActiveTask={isActiveTask}
                />
                : null }
                { isActiveTask ? 
                <CompleteButton
                  task={task} index={index} setIsPaused={setIsPaused}
                /> 
                : null}
                { task.actualTotalDuration > 0 ?
                <span className="badge bg-secondary my-1">Completed</span> 
                : null}
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-lg-2">
            <div className="container">
              <div className="row">
                <div className="col-6 col-xs-6 col-sm-3 col-lg-12 d-grid">
                  <MoveToTop
                    task={task}
                    index={index}
                  />
                </div>
                <div className="col-6 col-xs-6 col-sm-3 col-lg-12 d-grid">
                  <MoveUp
                    task={task}
                    index={index}
                  />
                </div>
                <div className="col-6 col-xs-6 col-sm-3 col-lg-12  d-grid">
                  <MoveDown
                    task={task}
                    index={index}
                  />
                </div>
                <div className="col-6 col-xs-6 col-sm-3 col-lg-12 d-grid">
                  <MoveToBottom
                    task={task}
                    index={index}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {task.durationOfBreak > 0 && (
        <div className={"col border rounded px-3 text-primary"+(isActiveBreak ? " border-success border-3" : "")}> 
          {task.durationOfBreak} minute Break
        </div>
      )}
    </>
  );
}

export default Task;