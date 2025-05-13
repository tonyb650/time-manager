import { createContext } from "react";
const RenderDateContext = createContext({renderDate : new Date(), setRenderDate : (() => {})});
export default RenderDateContext;