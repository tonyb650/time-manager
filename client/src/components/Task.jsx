import { Link } from "react-router-dom";
import chevron1up from "../assets/img/chevron-up.svg";
import chevron1down from "../assets/img/chevron-down.svg";
import pushpin from "../assets/img/pin-angle-fill.svg";
import editpencil from "../assets/img/pencil-fill.svg";
import MoveToTop from "./taskButtons/MoveToTop";
import MoveToBottom from "./taskButtons/MoveToBottom";
import addMinutes from "../utils/addMinutes";
import PauseResume from "./taskButtons/PauseResume";
import DeleteButton from "./taskButtons/DeleteButton";
import CompleteButton from "./taskButtons/CompleteButton";
import TaskDuration from "./taskFields/TaskDuration";


function Task(props) {
  const { task, index, isPaused, setIsPaused } = props;


  // * 'isActiveTask' returns true for rendering purposes
  const isActiveTask = new Date(task.startTime) < new Date() && addMinutes(new Date(task.startTime), task.durationOfTask) > new Date();

  // *'isActiveBreak' returns true for rendering purposes
  const isActiveBreak = addMinutes(new Date(task.startTime), task.durationOfTask) < new Date() && addMinutes(new Date(task.startTime), task.durationOfTask+task.durationOfBreak) > new Date();
  


  return (
    <>
      <div className={"container border rounded my-2 "+( isActiveTask ? isPaused ? "border-warning border-3":" border-success border-3" : "")}>
        <div className="row">
          <div className="col-12 col-xs-4 col-sm-3 col-lg-2">
            <div className="container">
              <div className="row py-1 gap-1">
                {task.isPinnedStartTime ? (
                  <div className="col-1 col-sm-12 text-danger">
                    <img className="" src={pushpin} /> 
                  </div>
                ) : null}
                <div className="border col-3 col-sm-12 rounded px-2 form-text ">
                  {new Date(task.startTime).toLocaleTimeString(
                    "en-US",
                    {
                      timeStyle: "short",
                    }
                  )}
                </div>
                <div className="col-3 col-sm-12 ">
                    <TaskDuration task={task} index={index}/>
                </div>
                <div className="border col-3 col-sm-12 rounded px-2 form-text ">
                  {new Date(
                    new Date(task.startTime).getTime() +
                      task.durationOfTask * 60 * 1000
                  ).toLocaleTimeString("en-US", { timeStyle: "short" })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-8 col-sm-5 col-lg-6">
            <div className="row">
              <div className="col d-flex justify-content-between">
                <h3 >
                  <Link className="text-white text-decoration-none" to={`/task/edit/${task._id}`}>
                    {task.taskTitle} {/* {task.taskDate.substring(0, 10)} */}
                  </Link>
                </h3>
                <span>
                  <Link to={`/task/edit/${task._id}`}>
                    <img src={editpencil} className="border rounded mx-1 p-1"/>
                  </Link>
                  <DeleteButton taskId = {task._id}/>
                </span>
              </div>
            </div>
            
            <div className="form-text">{task.taskBody}</div>
            <div className="form-text text-black-50">ID: {task._id}</div>
            <div className="form-text text-black-50">Index:{index}</div>
            <div className="form-text text-black-50">TotalDuration:{task.actualTotalDuration}</div>
          </div>
          <div className="col-12 col-xs-12 col-sm-4 col-lg-2">
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
                  <button type="button" className="btn btn-sm btn-light ">
                    <img src={chevron1up} /> Up
                  </button>
                </div>
                <div className="col-6 col-xs-6 col-sm-3 col-lg-12  d-grid">
                  <button className="btn btn-sm btn-light mt-1">
                    <img src={chevron1down} /> Down
                  </button>
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
