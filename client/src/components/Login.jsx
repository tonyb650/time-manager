import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = (e) =>  {
      e.preventDefault();
      // TODO: first thing upon attempt to login would be to 'logout' if there is a cookie and sessionStorage
      axios.post("http://localhost:8000/api/login", { email, password}, { withCredentials : true }) 
      .then((res) => {
        sessionStorage.setItem('userName', res.data.user.firstName)
        navigate('/tasks');
      } )
      .catch(err => {
        setErrors(err.response.data.message)
      })
  }

  return (
    <div >
      <form onSubmit={loginHandler}>
        <div className='form-group my-2'>
          <input type="text" className="form-control" name="email" placeholder='Email *' value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className='form-group my-2'>
          <input type="text" className="form-control" name="password" placeholder='Password *' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className='form-group my-2'>
          { errors && ( <p className='text-danger form-text'>{errors}</p> )}
          <button className='btnSubmit'>Log in</button>
        </div>
      </form>
    </div>
  )
}

export default Login