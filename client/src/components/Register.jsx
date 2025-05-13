import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register(props) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        confirmPassword:''
    });

    const changeHandler = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }

    const registerHandler = (e) => {
        e.preventDefault();
        // TODO: first thing upon attempt to register would be to 'logout' if there is a cookie and sessionStorage
        axios.post("http://localhost:8000/api/register", user, {withCredentials:true})
        .then((res) => {
          sessionStorage.setItem('userName', res.data.user.firstName)
          navigate("/tasks");
        })
        .catch(err => {
          setErrors(err.response.data.errors)
        })
    }

  return (
    <div>
      <form onSubmit={registerHandler}>
        <div className='form-group my-2'>
          <input type="text" className="form-control" name="firstName" placeholder='First Name *' value={user.firstName} onChange={changeHandler}/>
          { errors.firstName && ( <p className='text-danger form-text'>{errors.firstName.message}</p> )}
        </div>
        <div className='form-group my-2'>
          <input type="text" className="form-control" name="lastName" placeholder='Last Name *' value={user.lastName} onChange={changeHandler}/>
          { errors.lastName && ( <p className='text-danger form-text'>{errors.lastName.message}</p> )}
        </div>
        <div className='form-group my-2'>
          <input type="email" className="form-control" name="email" placeholder='Email *' value={user.email} onChange={changeHandler}/>
          { errors.email && ( <p className='text-danger form-text'>{errors.email.message}</p> )}
        </div>
        <div className='form-group my-2'>
            <input type="password" className="form-control" name="password" placeholder='Password *' value={user.password} onChange={changeHandler}/>
          { errors.password && ( <p className='text-danger form-text'>{errors.password.message}</p> )}
        </div>
        <div className='form-group my-2'>
            <input type="password" className="form-control" name="confirmPassword" placeholder='Confirm Password *' value={user.confirmPassword} onChange={changeHandler}/>
          { errors.confirmPassword && ( <p className='text-danger form-text'>{errors.confirmPassword.message}</p> )}
        </div>
        <button className="btnSubmit">Register</button>
      </form>
    </div>
  )
}

export default Register;