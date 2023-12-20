import { Link } from "react-router-dom";
import chevron1up from "../assets/img/chevron-up.svg";
import chevron1down from "../assets/img/chevron-down.svg";
// import chevron2down from "../assets/img/chevron-double-down.svg";
import arrow from "../assets/img/arrow-return-right.svg";
import MoveToTop from "./taskButtons/moveToTop";
import MoveToBottom from "./taskButtons/MoveToBottom";

// import { useContext } from "react";
// import TaskListContext from "../context/TaskListContext";

function Task(props) {
  // const  {taskList, setTaskList}  = useContext(TaskListContext);
  const { task, index, needsUpdate, setNeedsUpdate } = props;

  return (
    <>
      <div className="container border rounded my-2">
        <div className="row">
          <div className="col-12 col-xs-4 col-sm-3 col-lg-2">
            <div className="container">
              <div className="row py-1 gap-1">
                {task.parentId != null && task.parentId != "" ? (
                  <div className=" col-2 col-sm-12 text-danger">
                    <img className="bg-danger" src={arrow} /> Link
                  </div>
                ) : null}
                <div className="border col-3 col-sm-12 rounded px-2">
                  {new Date(task.startTimeScheduled).toLocaleTimeString(
                    "en-US",
                    {
                      timeStyle: "short",
                    }
                  )}
                </div>
                <div className="border col-3 col-sm-12 rounded px-2">
                  {task.durationOfTask.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  min
                </div>
                <div className="border col-3 col-sm-12 rounded px-2">
                  {new Date(
                    new Date(task.startTimeScheduled).getTime() +
                      task.durationOfTask * 60 * 1000
                  ).toLocaleTimeString("en-US", { timeStyle: "short" })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-8 col-sm-5 col-lg-6">
            <Link className="text-white text-decoration-none" to={`/task/edit/${task._id}`}>
              <h3 >
                {task.taskTitle} - {task.taskDate.substring(0, 10)}
              </h3>
            </Link>
            <div className="form-text">{task.taskBody}</div>
            <div className="form-text text-black-50">ID: {task._id}</div>
            <div className="form-text text-black-50">Index:{index}</div>
            <div className="form-text text-black-50">ParentId: {task.parentId}</div>
          </div>
          <div className="col-12 col-xs-12 col-sm-4 col-lg-2">
            <div className="container">
              <div className="row">
                <div className="col-6 col-xs-12 col-sm-12 col-md-12 d-grid ">
                  <button className="btn btn-secondary">Start / Pause</button>
                </div>
                <div className="col-6 col-xs-12 col-sm-12 col-md-12 d-grid ">
                  <button className="btn btn-secondary">Complete</button>
                </div>
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
                    needsUpdate={needsUpdate}
                    setNeedsUpdate={setNeedsUpdate}
                  />
                </div>
                <div className="col-6 col-xs-6 col-sm-3 col-lg-12 d-grid">
                  <button type="button" className="btn btn-sm btn-light ">
                    <img src={chevron1up} /> Up**
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
                    needsUpdate={needsUpdate}
                    setNeedsUpdate={setNeedsUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {task.durationOfBreak > 0 ? (
        <div className="col border rounded px-3 text-success">
          {task.durationOfBreak} minute Break
        </div>
      ) : null}
    </>
  );
}

export default Task;
