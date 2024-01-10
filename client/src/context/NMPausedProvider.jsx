import { useState } from "react";
import PausedContext from "./NMPausedContext"

function PausedProvider(props) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <PausedContext.Provider value={{ isPaused : isPaused, setIsPaused : setIsPaused}}>
      {props.children}
    </PausedContext.Provider>
  )
}

export default PausedProvider