import React, { useEffect } from "react";

function DisplayClock(props) {
  const { currTime, setCurrTime } = props;

  // *HERE WE SET UP OUR RUNNING DISPLAY CLOCK*
  useEffect(() => {
    // Start clock immediately, up first render
    const time = new Date().toLocaleTimeString("en-US", { timeStyle: "short" });
    setCurrTime(time);
    // Re-render every 5 seconds by calling 'setCurrTime'
    setInterval(() => {
      const time = new Date().toLocaleTimeString("en-US", {
        timeStyle: "short",
      });
      setCurrTime(time);
    }, 5000);
  }, []);

  return <h2>{currTime}</h2>;
}

export default DisplayClock;
