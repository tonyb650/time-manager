import React from 'react'

function EditTask() {
    const navigate = useNavigate();

    // useState destructuring
    const [ taskTitle, setTaskTitle]= useState("");
    const [ taskBody, setTaskBody]= useState("");
    const [ durationOfTask, setDurationOfTask]= useState(0);
    const [ durationOfBreak, setDurationOfBreak]= useState(0);
    const [ parentId, setParentId]= useState("");
    const [ timePicker, setTimePicker]= useState("08:00");
    const [ datePicker, setDatePicker]= useState(new Date().toISOString().substring(0,10)); // Need to fix this but I'll come back to it. It uses GMT instead of Pacific time...
    const [ isComplete, setIsComplete]= useState(false);
    const [ errors, setErrors] = useState([]);
  
    // "Submit" button pressed = "handleSubmit"
    const handleSubmit = (e) => {
      e.preventDefault();
      const dateParts = datePicker.split("-");     // split() datePicker format = "2012-10-12"
      const timeParts = timePicker.split(":");     // split() timePicker format = "12:30"
      // combine dateParts & timeParts to create new Date object to be stored in task object
      const selectedDateTime = new Date(dateParts[0], dateParts[1]-1, dateParts[2], timeParts[0], timeParts[1]);
      // Now, create taskObject with all the fields
      const taskObject = {taskTitle, taskBody, durationOfTask, durationOfBreak, parentId, "startTimeScheduled" : selectedDateTime, isComplete, "taskDate" : selectedDateTime}
      console.log(taskObject)
      taskObject.startTimeActual = null;
      console.log(taskObject)
      axios.patch('http://localhost:8000/api/tasks', taskObject)
        .then(res => { 
            console.log(res);
            navigate('/')
        })
        .catch(err => {
          console.log(err);
          const errorArray=[];
          const responseErrors = err.response.data.errors;
          for(const key of Object.keys(responseErrors)) {
            errorArray.push(responseErrors[key].message);
          }
          setErrors(errorArray);
        })
      }
  
    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div>
              <label>taskTitle:</label>
              <input type="text" value={taskTitle} onChange={(e) => {setTaskTitle(e.target.value)}}/>
          </div>
          <div>
              <label>taskBody:</label>
              <input type="text" value={taskBody} onChange={(e) => {setTaskBody(e.target.value)}}/>
          </div>
          <div>
              <label>date:</label>
              <input type="date" value={datePicker} onChange={(e) => {setDatePicker(String(e.target.value))}}/>
          </div>  
          <div>
              <label>time:</label>
              <input type="time" value={timePicker} onChange={(e) => {setTimePicker(String(e.target.value))}}/>
          </div>   
          <div>
              <label>durationOfTask:</label>
              <input type="number" value={durationOfTask} onChange={(e) => {setDurationOfTask(e.target.value)}}/>
          </div>        
          <div>
              <label>durationOfBreak:</label>
              <input type="number" value={durationOfBreak} onChange={(e) => {setDurationOfBreak(e.target.value)}}/>
          </div>        
          <div>
              <label>isComplete:</label>
              <input type="checkbox" value={isComplete} onChange={(e) => {(isComplete) ? setIsComplete(false) : setIsComplete(true)}}/>
          </div>        
          <div>
              <label>parentId:</label>
              <input type="text" value={parentId} onChange={(e) => {setParentId(e.target.value)}}/>
          </div>
          <input className="btn btn-secondary" type="submit" value="Add" />
        </form>
        <Link to="/">Cancel</Link>
      </div>
    )
}

export default EditTask