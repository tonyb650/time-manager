import React from "react";
import addMinutes from "../../utils/addMinutes";

function PauseResume(props) {
  const { task, index, isPaused, setIsPaused, isActiveTask } = props;

  function handleClick() {
    setIsPaused(!isPaused);
  }

  // TODO: if this component is conditionally rendered in Task.jsx, we don't need the conditional render here on isActive
  return (
    <div className="col-6 col-xs-12 col-sm-12 col-md-12 d-grid ">
      { isActiveTask ?
          isPaused ? 
          <button className="btn  btn-outline-warning" onClick={handleClick}>Resume</button> :
          <button className="btn  btn-success" onClick={handleClick}>Pause</button>
        :
        <button className="btn btn-secondary" disabled>Pause</button>}
      {/* { isPaused ?
        "Paused":
        "Running"} */}
    </div>
  );
}

export default PauseResume;
