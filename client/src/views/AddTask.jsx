import React, { useContext, useState } from 'react'
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import NavBar from '../components/NavBar';
import { toISODateString } from '../utils/formatDate';
import RenderDateContext from '../context/RenderDateContext';

function AddTask(props) {
  const navigate = useNavigate();
  
  // TODO: this is a hack to redirect upon logout, correct technique might be AuthProvider context wrapper
  const userName = sessionStorage.getItem('userName')
  if(userName == null){
    navigate("/");
  }

  const { renderDate, setRenderDate }= useContext(RenderDateContext);
  // Set up blank task object with useState destructuring
  const initialTaskDate = toISODateString(renderDate);
  const initialStartTime = "08:00"
  const [ task, setTask ] = useState({
    taskTitle: '',
    taskBody: '',
    durationOfTask: '',
    durationOfBreak: '',
    actualTotalDuration: '',
    startTime: initialStartTime,
    isPinnedStartTime: false,
    taskDate: initialTaskDate
  });
  // Set up state to hold validation errors
  const [ errors, setErrors] = useState({}); // error properties look like this: { fieldName : { message : "fieldName does not meet validations"}}

  let formIsValid = false;                                                                       // 'formIsValid' controls enable/disable of form Submit button
  formIsValid = errors.durationOfBreak=="" && errors.durationOfTask=="" && errors.taskTitle==""; // Empty string means that each field has been checked in "onBlur"
  // TODO: getting an error on above line for some reason with durationOfBreak is undefined. need to test this

  // *Handle changes on form fields here*
  const handleChange = (e) => {
    if(e.target.type.toLowerCase()=="checkbox"){
      setTask({
        ...task,
        [e.target.name] : e.target.checked
      })
    } else {
      setTask({
        ...task,
        [e.target.name] : e.target.value
      })
    }
  }

  // *Handle client-side validations here*
  // 'onBlur' means when a user clicks off of a form field.
  // At that point, we check if the e.target.value passes validations
  // TODO: When picking from auto-fill suggestions, onBlur doesn't format field correctly, something in CSS maybe
  const handleBlur = (e) => {
    switch (e.target.name){
      case 'taskTitle':
        if(e.target.value.trim().length < 2){
          setErrors({...errors,  taskTitle :{ message: "Task title is required"}});
        } else {
          setErrors({...errors,  taskTitle : "" });
        }
        break;
      case 'durationOfTask':
        if(Number.isNaN(e.target.value) || e.target.value < 1){
          setErrors({...errors,  durationOfTask :{ message: "Task duration is required"}});
        } else {
          setErrors({...errors,  durationOfTask : "" });
        }
        break;
      case 'durationOfBreak':
        if(!e.target.value==""){                    // this is here to clear any back-end error when 0 or other number is entered
          setErrors({...errors,  durationOfBreak : "" });
        }
        break;
      default:
        throw new Error("unexpected target name: "+e.target.name);
    }
  }

  // *Handle form submission here*
  const handleSubmit = (e) => {
    e.preventDefault();
    task.taskTitle = task.taskTitle.trim();         // remove any leading or trailing whitespace
    task.taskBody = task.taskBody.trim();           // remove any leading or trailing whitespace

    axios.post('http://localhost:8000/api/tasks', task, { withCredentials : true })
      .then(res => { 
        navigate('/tasks');
      })
      .catch(err => {
        setErrors(err.response.data.errors);
      })
    }

  return (
    <>
      {/* <NavBar/> */}
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
              <h3 className="text-info">New Task</h3>
              <form onSubmit={handleSubmit}>
                <div className='form-floating mb-3'>
                  <input type="text" className='form-control' name="taskTitle" id="taskTitle" placeholder='taskTitle:' value={task.taskTitle} onChange={handleChange} onBlur={handleBlur}/>
                  <label htmlFor='taskTitle' className='form-label'>Task Title:</label>
                  { errors.taskTitle && ( <p className='text-danger form-text'>{errors.taskTitle.message}</p> )}
                </div>
                <div className='form-floating mb-3'>
                    <input type="text" className='form-control'  name="taskBody" id="taskBody" placeholder="taskBody" value={task.taskBody} onChange={handleChange}/>
                    <label htmlFor='taskBody' className='form-label'>Details:</label>
                </div>
                <div className='form-floating mb-3'>
                    <input type="date" className='form-control'  name="taskDate" id="taskDate" value={task.taskDate} onChange={handleChange}/>
                    <label htmlFor='taskDate' className='form-label'>Date:</label>
                    { errors.taskDate ? <p className='text-danger form-text'>{errors.taskDate.message}</p> : null }
                </div>
                <div className='form-floating mb-3'>
                    <input type="time" className='form-control'  name="startTime" id="startTime" value={task.startTime} onChange={handleChange}/>
                    <label htmlFor='startTime' className='form-label'>Time:</label>
                </div>
                <div className='form-check form-switch mb-3'>
                    <input type="checkbox" className='form-check-input'  name="isPinnedStartTime" id="isPinnedStartTime" checked={task.isPinnedStartTime} onChange={handleChange}/>
                    <label htmlFor='isPinnedStartTime' className='form-check-label'>isPinnedStartTime:</label>
                </div>
                <div className='form-floating mb-3'>
                    <input type="number" className='form-control'  name="durationOfTask" id="durationOfTask" placeholder="durationOfTask" value={task.durationOfTask} onChange={handleChange} onBlur={handleBlur} />
                    <label htmlFor='durationOfTask' className='form-label'>Duration (minutes):</label>
                    { errors.durationOfTask ? <p className='text-danger form-text'>{errors.durationOfTask.message}</p> : null }
                </div>
                <div className='form-floating mb-3'>
                    <input type="number" className='form-control'  name="durationOfBreak" id="durationOfBreak" placeholder="durationOfBreak" value={task.durationOfBreak} onChange={handleChange} onBlur={handleBlur}/>
                    <label htmlFor='durationOfBreak' className='form-label'>Break (minutes):</label>
                    { errors.durationOfBreak ? <p className='text-danger form-text'>{errors.durationOfBreak.message}</p> : null }
                </div>
                <input className={`btn btn-outline-info ${ formIsValid ? '' : 'disabled' }`} type="submit" value="Add" /><Link className='btn btn-outline-secondary text-decoration-none mx-3' to="/tasks">Cancel</Link>
              </form>
              <span className='' ></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddTask;