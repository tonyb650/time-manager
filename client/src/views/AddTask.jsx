import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import NavBar from '../components/NavBar';

function AddTask(props) {
  const navigate = useNavigate();

  // useState destructuring
  const [ task, setTask ] = useState({
    taskTitle: '',
    taskBody: '',
    durationOfTask: '',
    durationOfBreak: '',
    actualTotalDuration: '',
    startTime: '',
    isPinnedStartTime: false,
    taskDate: ''
  });
  const [ timePicker, setTimePicker]= useState("08:00"); // TODO: Possibly eliminate timePicker ?
  const [ datePicker, setDatePicker]= useState(new Date().toISOString().substring(0,10)); // Need to fix this but I'll come back to it. It uses GMT instead of Pacific time...
  const [ errors, setErrors] = useState({}); // error properties look like this: { fieldName : { message : "fieldName does not meet validations"}}

  // 'formIsValid' controls enable/disable of form Submit button
  let formIsValid = false;
  formIsValid = errors.durationOfBreak=="" && errors.durationOfTask=="" && errors.taskTitle==""; // Empty string means that each field has been checked in "onBlur"

  // handleChange for text, numbers and checkboxes on form.
  // Note that datePicker (and timePicker) are handled within the form 'onChange'
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
  }}

  // *Handle client-side validations here*
  // 'onBlur' means when a user clicks off of a form field.
  // At that point, we check if the e.target.value is valid
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
        if(!e.target.value==""){ // this is here to clear any back-end error when 0 or other number is entered
          setErrors({...errors,  durationOfBreak : "" });
        }
        break;
      default:
        throw new Error("unexpected target name: "+e.target.name);
    }
  }

  // *HANDLE FORM SUBMISSION HERE*
  const handleSubmit = (e) => {
    // HOW WE HANDLE FORM SUBMISSION:
    // 1) Combine datePicker & timePicker to create a single Date Object 'selectedDateTime
    // 2) Set 'taskDate' to that value
    // TODO: eliminate timePicker(?) & confirm that datePicker is providing the correct value such that this will work in all time zones
    // 3) Take care of non-form values: 'startTimeActual' & 'startTimeScheduled' (set to null)
    // 4) Attempt to save in DB -> .then() return to dashboard -> .catch() process validation errors from backend

    e.preventDefault();
    // console.log(datePicker);
    // console.log(timePicker);
    const dateParts = datePicker.split("-");     // split() datePicker format = "2012-10-12"
    const timeParts = timePicker.split(":");     // split() timePicker format = "12:30"
    // console.log(dateParts)
    // console.log(timeParts)
    const selectedDateTime = new Date(dateParts[0], dateParts[1]-1, dateParts[2], timeParts[0], timeParts[1]);
    // console.log(selectedDateTime)
    task.taskTitle = task.taskTitle.trim();
    task.taskBody = task.taskBody.trim();
    task.taskDate = selectedDateTime;
    task.startTime = selectedDateTime;
    console.log("Task to be saved: ")
    console.log(task)
    axios.post('http://localhost:8000/api/tasks', task)
      .then(res => { 
        console.log("Successfully saved.")
        console.log(res);
        navigate('/')
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
                    <input type="date" className='form-control'  name="datePicker" id="datePicker" value={datePicker} onChange={(e) => {setDatePicker(String(e.target.value))}}/>
                    <label htmlFor='datePicker' className='form-label'>Date:</label>
                    { errors.taskDate ? <p className='text-danger form-text'>{errors.taskDate.message}</p> : null }
                </div>
                <div className='form-floating mb-3'>
                    <input type="time" className='form-control'  name="timePicker" id="timePicker" value={timePicker} onChange={(e) => {setTimePicker(String(e.target.value))}}/>
                    <label htmlFor='timePicker' className='form-label'>Time:</label>
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
                <input className={`btn btn-outline-info ${ formIsValid ? '' : 'disabled' }`} type="submit" value="Add" /><Link className='btn btn-outline-secondary text-decoration-none mx-3' to="/">Cancel</Link>
              </form>
              <span className='' ></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddTask;