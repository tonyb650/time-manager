import { useState } from "react";
import UserContext from "./NMUserContext";

function UserProvider(props) {
  const [userId, setUserId] = useState("");

  return (
    <UserContext.Provider value={{ userId : userId, setUserId : setUserId}}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider;