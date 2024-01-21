import DisplayClock from "./DisplayClock";
import { Link, useNavigate } from "react-router-dom";
import alarm from "../assets/img/alarm.svg"
import DatePicker from "./DatePicker";
import plus from "../assets/img/plus-square.svg"
import axios from "axios";
import { useContext } from "react";
import RenderDateContext from "../context/RenderDateContext";

function NavBar(props) {
  const { currTime, setCurrTime } = props;
  const { renderDate, setRenderDate } = useContext(RenderDateContext);
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
    <nav className="navbar navbar-expand-md navbar-colors navbar-dark">
      <div className="container">
        {/* <span className="navbar-brand">
          <img src={alarm} alt="Logo" />
        </span> */}
        <span className="navbar-brand">
          <DisplayClock currTime={currTime} setCurrTime={setCurrTime} />
        </span>
        <span className="">
          <DatePicker />
        </span>
        <Link to="/tasks/add">
          <img src={plus} height={26} alt="Add Task" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page">Templates</Link>
            </li>
            <li className="nav-item">
          <a className="nav-link" href="#">Features</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Pricing</a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
          </ul>
        </div>
        {/* <button
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
        </div> */}
      </div>
    </nav>
  );
}

export default NavBar;
