import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = (e) =>  {
      e.preventDefault();
      axios.post("http://localhost:8000/api/login", { email, password}, { withCredentials : true }) 
      .then((res) => {
        // console.log('successful Login! here is res:');
        // console.log(res);
        // console.log(res.data._id)
        sessionStorage.setItem('userId', res.data.user._id)
        navigate('/tasks');
      } )
      .catch(err => console.log(err))
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
          <button className='btnSubmit'>Log in</button>
        </div>
      </form>
    </div>
  )
}

export default Login