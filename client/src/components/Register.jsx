import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register(props) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState("");
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

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8000/api/register", user, {withCredentials:true})
        .then((res) => {
          // console.log("successfully saved");
          // console.log(res);
          // console.log(res.data._id)
          // setUserId(res.data.user._id)
          sessionStorage.setItem('userId', res.data.user._id)
          navigate("/tasks");
        })
        .catch(err => {
          // console.log("in catch attempting registration save to DB")
          // console.log(err)
          // console.log(err.response.data.message)
          setErrors(err.response.data.message)
        })
    }

  return (
    <div>
        <form onSubmit={submitHandler}>
            {errors ? <span>{errors}</span>:null}
            <div className='form-group my-2'>
                <input type="text" className="form-control" name="firstName" placeholder='First Name *' value={user.firstName} onChange={changeHandler}/>
            </div>
            <div className='form-group my-2'>
                <input type="text" className="form-control" name="lastName" placeholder='Last Name *' value={user.lastName} onChange={changeHandler}/>
            </div>
            <div className='form-group my-2'>
                <input type="email" className="form-control" name="email" placeholder='Email *' value={user.email} onChange={changeHandler}/>
            </div>
            <div className='form-group my-2'>
                <input type="text" className="form-control" name="password" placeholder='Password *' value={user.password} onChange={changeHandler}/>
            </div>
            <div className='form-group my-2'>
                <input type="text" className="form-control" name="confirmPassword" placeholder='Confirm Password *' value={user.confirmPassword} onChange={changeHandler}/>
            </div>
            <button className="btnSubmit">Register</button>
        </form>
    </div>
  )
}

export default Register;