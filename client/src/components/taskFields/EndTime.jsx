import { toDateObject, toTimeString } from "../../utils/formatDate";
import  addMinutes  from "../../utils/addMinutes";

function EndTime(props) {
  const { task } = props;

  let startTime = toDateObject(task.taskDate,task.startTime);
  let endTimeObj = addMinutes(startTime,task.durationOfTask);
  let localEndTime = toTimeString(endTimeObj)

  return (
    <form>
      <input className="form-control form-control-sm px-1" type="time" 
      value={localEndTime} disabled/>
  </form>
  )
}

export default EndTime