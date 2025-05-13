import { useState } from "react";
import RenderDateContext from "./RenderDateContext";

function RenderDateProvider(props) {
  const [renderDate, setRenderDate] = useState(new Date());

  return (
    <RenderDateContext.Provider value={{ renderDate, setRenderDate}}>
      {props.children}
    </RenderDateContext.Provider>
  )
}

export default RenderDateProvider;