import { useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from 'axios';
import patchTask from '../utils/patchTask';

function EditTask(props) {
  const navigate = useNavigate();

  // TODO: this is a hack to redirect upon logout, correct technique might be AuthProvider context wrapper
  const userName = sessionStorage.getItem('userName')
  if(userName == null){
    navigate("/");
  }

  const { id } = useParams();
  const [ task, setTask ] = useState({
    _id : '',
    taskTitle: '',
    taskBody: '',
    durationOfTask: '',
    durationOfBreak: '',
    actualTotalDuration: '',
    startTime: '',
    isPinnedStartTime: false,
    taskDate: ''
  });

  const [ errors, setErrors] = useState({                           // Set up state to hold validation errors
    durationOfBreak : '',                                           // Note: error properties look like this: 
    durationOfTask : '',                                            // { fieldName : { message : "fieldName does not meet validations"}}
    taskTitle : ''
  }); 

  /* Initialize 'errors' object upon first load of page*/
  let formIsValid = true;                                                                       // 'formIsValid' controls enable/disable of form Submit button
  formIsValid = errors.durationOfBreak=="" && errors.durationOfTask=="" && errors.taskTitle==""; // Empty string means that each field has been checked in "onBlur"



  useEffect(() => {                                                 // Get task from DB and setTask in state
    axios.get(`http://localhost:8000/api/tasks/${id}`, { withCredentials : true })
    .then(res => {
      console.log("axios.get the one task. does it include the userId?")
      console.log(res.data)
      setTask ( {...res.data} );
    })
    .catch(err => console.error(err));
  },[]);

  const handleChange = (e) => {                                     // Handle changes on form fields here
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

  /* Handle client-side validations here.
    'onBlur' means when a user clicks off of a form field.
    At that point, we check if the e.target.value passes validations */
  const handleBlur = (e) => {
    switch (e.target.name){
      case 'taskTitle':
        if(e.target.value.trim().length < 2){
          setErrors({...errors,  taskTitle :{ message: "Task title is required"}});
        } else {
          setTask({...task, taskTitle : e.target.value.trim()});
          setErrors({...errors,  taskTitle : "" });
        }
        break;
      case 'taskBody':
        setTask({...task, taskBody : e.target.value.trim()});
        break;
      case 'durationOfTask':
        if(Number.isNaN(e.target.value) || e.target.value < 1){
          setErrors({...errors,  durationOfTask :{ message: "Task duration is required"}});
        } else {
          setErrors({...errors,  durationOfTask : "" });
        }
        break;
      case 'durationOfBreak':
        if(!e.target.value==""){                                    // this is here to clear any back-end error when 0 or other number is entered
          setErrors({...errors,  durationOfBreak : "" });
        }
        break;
      default:
        throw new Error("unexpected target name: "+e.target.name);
    }
  }

  const handleSubmit = (e) => {                                     // Handle form submission here
    e.preventDefault();
    patchTask(task,false,"Successfully patched updated task in EditTask.jsx")
    navigate("/tasks");
  }

  return (
    <>
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
              <h3 className="text-info">Update Task</h3>
              <form onSubmit={handleSubmit}>
                <div className='form-floating mb-3'>
                  <input type="text" className='form-control' name="taskTitle" id="taskTitle" placeholder='taskTitle:' value={task.taskTitle} onChange={handleChange} onBlur={handleBlur}/>
                  <label htmlFor='taskTitle' className='form-label'>Task Title:</label>
                  { errors.taskTitle && ( <p className='text-danger form-text'>{errors.taskTitle.message}</p> )}
                </div>
                <div className='form-floating mb-3'>
                    <input type="text" className='form-control'  name="taskBody" id="taskBody" placeholder="taskBody" value={task.taskBody} onChange={handleChange} onBlur={handleBlur}/>
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
                <input className={`btn btn-outline-info ${ formIsValid ? '' : 'disabled' }`} type="submit" value="Update" /><Link className='btn btn-outline-secondary text-decoration-none mx-3' to="/tasks">Cancel</Link>
              </form>
              <span className='' ></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditTask;