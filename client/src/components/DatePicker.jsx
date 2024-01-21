import React, { useContext, useState } from "react";
import { toISODateString, toLocalDateString } from "../utils/formatDate";
import RenderDateContext from "../context/RenderDateContext";

function DatePicker(props) {
  const { renderDate, setRenderDate } = useContext(RenderDateContext);
  const [ datePicker, setDatePicker]= useState(toISODateString(renderDate)); // 'datePicker' is a string in format YYYY-mm-dd (ISO)

  // * Handle user picking a date*
  const handleDatePick = (e) => {
    e.preventDefault();
    const newDate = String(e.target.value);             // Form value comes through in this format: "2023-12-03" (ISO)

    setDatePicker(newDate);                             // Set value for 2-way binding in form
    /*  
    Then, reformat from ISO to local time string
    and then use that string to create a UTC time Date object
    then, set RenderDate to that object 
    */
    setRenderDate(new Date(toLocalDateString(newDate))); // Sets Date to UTC time, not local
  };

  return (
    <form>
      <input
        type="date"
        value={datePicker}
        onChange={(e) => {
          handleDatePick(e);
        }}
      />
    </form>
  );
}

export default DatePicker;