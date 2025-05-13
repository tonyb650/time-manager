import axios from "axios";

/**
 * patchTask function
 * Accepts task object and updates/patches the task in the DB using axios.patch.
 * Optionally logs message when successful when logSuccess = true.
 * Default success message can be overridden by 'successMessage' 
 * @param {object} taskObject   
 * @param {boolean} logSuccess (optional)   
 * @param {string} successMessage (optional)   
 */
export default function patchTask (taskObject, logSuccess = false, successMessage = "Successfully updated task in DB.", ){
  axios.patch(`http://localhost:8000/api/tasks/${taskObject._id}`, taskObject, { withCredentials : true })
  .then(res => {
    if(logSuccess){
      console.log(successMessage);
      console.log(res);
    }
  })
  .catch(err => console.error(err));
}