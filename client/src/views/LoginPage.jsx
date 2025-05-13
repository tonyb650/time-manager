import React from "react";
import Register from "../components/Register";
import Login from "../components/Login";
import logo from "../assets/img/logo.png";
// import highFive from "../assets/img/login-photo.jpg";

function LoginPage() {
  // TODO: if there is already a valid cookie & token, then redirect to /tasks ??? -OR- automatically log out ????

  return (
    <div className="container">
      <div className="container login-container">
        <div className="row">
          <div className="col-md-6 login-form-1">
            <div className="text-center">
              <div className='d-none d-md-block'>
              <img src={logo} alt="" style={{width: "100px", height: "100px"}} className='img-fluid'/>
            </div>
              {/* <h1>Time Manager</h1> */}
            </div>
            <div className="d-none d-sm-block pt-4 x-5 text-center">
              <h2>Stay on track and keep first things first, every day.</h2>
            </div>
            {/* <h2>User Login</h2> */}
            <Login />
          </div>
          <div className="col-md-6 login-form-2">
            <h2>Register New User</h2>
            <Register />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
