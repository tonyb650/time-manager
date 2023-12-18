import { Link } from "react-router-dom";
import chevron1up from "../assets/img/chevron-up.svg";
import chevron1down from "../assets/img/chevron-down.svg";
import chevron2down from "../assets/img/chevron-double-down.svg";
import arrow from "../assets/img/arrow-return-right.svg"
import MoveToTop from "./taskButtons/moveToTop";

function Task(props) {
  const  {task, index, taskList, setTaskList, needsUpdate, setNeedsUpdate }  = props;

  return (
    <div className="container border rounded my-2">
      <div className="row">
        <div className="col-2">
        {task.parentId != null && task.parentId != "" ? (
            <div className="text-danger"><img className="bg-danger" src={arrow} /> Linked</div>
          ) : null}
          <div className="border rounded px-2">
            {new Date(task.startTimeScheduled).toLocaleTimeString("en-US", {
              timeStyle: "short",
            })}
          </div>
          <div className="border rounded px-2">
            {task.durationOfTask.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            min
          </div>{" "}
          {/* < - This may be wrong */}
          <div className="border rounded px-2">
            {new Date(
              new Date(task.startTimeScheduled).getTime() +
                task.durationOfTask * 60 * 1000
            ).toLocaleTimeString("en-US", { timeStyle: "short" })}
          </div>

        </div>
        <div className="col-6">
          <h2 className="">
            {task.taskTitle} - {task.taskDate.substring(0, 10)}
          </h2>
          <div className="d-flex justify-content-between">
            <span>
              {task.taskBody} ID: {task._id}
            </span>
            <Link to={`/task/edit/${task._id}`}>edit</Link>
            {index}
          </div>
          <div>
            ParentId: {task.parentId}
          </div>
        </div>
        <div className="col-2">
          <div>
            <button className="btn btn-secondary mt-1">Start / Pause</button>
          </div>
          <div>
            <button className="btn btn-secondary mt-1">Complete</button>
          </div>
        </div>
        <div className="col-2">
          <div>
            <MoveToTop task={task} index={index} taskList={taskList} setTaskList={setTaskList} needsUpdate={needsUpdate} setNeedsUpdate={setNeedsUpdate}/>
          </div>
          <div>
            <button className="btn btn-sm btn-secondary mt-1">
              <img src={chevron1up} /> Up**
            </button>
          </div>
          <div>
            <button className="btn btn-sm btn-secondary mt-1">
              <img src={chevron1down} /> Down
            </button>
          </div>
          <div>
            <button className="btn btn-sm btn-secondary mt-1">
              <img src={chevron2down} /> Btm*
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col border rounded m-1 bg-success-subtle">
          {task.durationOfBreak > 0
            ? `${task.durationOfBreak} minute Break`
            : "No break"}
        </div>
      </div>
    </div>
  );
}

export default Task;
