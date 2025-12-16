import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const LeaveForm = () => {
    const [startDate, setStartDate] = useState(new Date());
  return (
   <div>
     <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
            <label htmlFor="">Name</label>
            <input className="border rounded-md" placeholder="" type="text" name="" id="" />
        </div>
        <div className="flex flex-col">
            <label htmlFor="">Approver</label>
            <input className="border rounded-md" placeholder="" type="text" name="" id="" />
        </div>
        <div className="flex flex-col">
            <label htmlFor="">Leave balance</label>
            <input className="border rounded-md" placeholder="" type="text" name="" id="" />
        </div>
        <div className="flex flex-col">
            <label htmlFor="">Leave Type</label>
            <input className="border rounded-md" placeholder="" type="text" name="" id="" />
        </div>
    </div>
    <div>
        <p>Reason</p>
        <textarea className="text-md w-full h-37.5 border" />
    </div>
    <div className="grid grid-cols-3">
        <div className="flex flex-col">
        <p>From</p>
        <DatePicker selected={startDate} onChange={(date:any) => setStartDate(date)} />
    </div>
    <div className="flex flex-col">
        <p>Until</p>
        <DatePicker selected={startDate} onChange={(date:any) => setStartDate(date)} />
    </div>
    <div className="flex flex-col">
        <p>Duration</p>
       <p>Total</p>
    </div>
    </div>
    <div>
        <button className="textlg rounded-md p-2 w-full bg-yellow-600 my-2">Submit</button>
    </div>
   </div>
  )
}

export default LeaveForm