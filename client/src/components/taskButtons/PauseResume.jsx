import React from "react";

function PauseResume(props) {
  const { isPaused, setIsPaused } = props;

  function handleClick() {
    setIsPaused(!isPaused);
  }

  return (
    <div className="col-6 col-xs-12 col-sm-12 col-md-12 d-grid my-1">
      { isPaused ? 
          <button className="btn  btn-outline-warning" onClick={handleClick}>Resume</button> :
          <button className="btn  btn-info" onClick={handleClick}>Pause</button>
      }
    </div>
  );
}

export default PauseResume;
