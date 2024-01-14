// import React, { useContext } from "react";
import DisplayClock from "./DisplayClock";
import { Link, useNavigate } from "react-router-dom";
import alarm from "../assets/img/alarm.svg"
import DatePicker from "./DatePicker";
import plus from "../assets/img/plus-square.svg"
import axios from "axios";

function NavBar(props) {
  const { currTime, setCurrTime, setRenderDate } = props;
  const navigate = useNavigate();

  const logoutUser = () => {
    console.log("entered logout user")
    axios.post('http://localhost:8000/api/logout',{},{withCredentials:true})
    .then(res => {
      console.log("successfully logged out");
      sessionStorage.removeItem('userId');
      navigate("/");
    })
    .catch(err => console.log("error logging out"+err))
}

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        {/* <span className="navbar-brand">
          <img src={alarm} alt="Logo" />
        </span> */}
        <span className="me-2">
          <DisplayClock currTime={currTime} setCurrTime={setCurrTime} />
        </span>
        <span className="">
          <DatePicker setRenderDate={setRenderDate} />
        </span>
        <Link to="/tasks/add">
          <img src={plus} height={26} alt="Add Task" />
        </Link>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-label="Expand Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page">Templates</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" aria-current="page">Settings</Link>
            </li>
            <li className="nav-item">
              <button onClick={logoutUser} className="nav-link btn-link" aria-current="page">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
