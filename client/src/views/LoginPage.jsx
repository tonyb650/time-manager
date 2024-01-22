import React from 'react'
import Register from '../components/Register'
import Login from '../components/Login'
import highFive from '../assets/img/login-photo.jpg'

function LoginPage() {

  // TODO: if there is already a valid cookie & token, then redirect to /tasks ??? -OR- automatically log out ????

  return (
<div className="container">
		<div className="text-center">
			<h1>Time Manager</h1>
		</div>
		<div className="d-none d-sm-block px-5 text-center">
			<h3>Stay on track and keep first things first, every day.</h3>
		</div>
		<div className="container login-container">
			<div className="row">
				<div className="col-md-6 login-form-1">
          <div className='d-none d-lg-block'>
            <img src={highFive} alt="Coworkers celebrating" className='img-fluid'/>
          </div>
        <h2>User Login</h2>
          <Login/>
				</div>
				<div className="col-md-6 login-form-2">
        <h2>Register New User</h2>
          <Register/>
				</div>
			</div>
		</div>
	</div>
  )
}

export default LoginPage