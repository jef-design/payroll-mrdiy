import { Link } from "react-router-dom";
import { useStore } from "../services/useStore";
import { MdOutlinePendingActions } from "react-icons/md";
import { BsCalendar2Day } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const EmployeeProfile = () => {
  const { user } = useStore();

  const {data} = useQuery({
    queryKey: ['getpending'],
    queryFn: async () => {
      const responses = await axios.get('http://localhost:5000/employee/leave')
      return responses.data
    }
  })
  
console.log(data)
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h2>
            <p className="text-sm text-gray-500 mt-1">Employee ID: {user?.EEID || "N/A"}</p>
          </div>
          <img
            src={"../src/assets/diypanda.jpeg"}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <BsCalendar2Day className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Leave Balance</p>
              <p className="text-lg font-semibold text-gray-800">{user?.leaveCredits || 0} Days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-md border border-blue-200">
            <MdOutlinePendingActions className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Leaves</p>
              <p className="text-lg font-semibold text-gray-800">{"0"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-green-50 p-4 rounded-md border border-green-200">
            <FaRegCheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Approved Leaves</p>
              <p className="text-lg font-semibold text-gray-800">{0}</p>
            </div>
          </div>
       
        </div>

        {/* File Leave Button */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/leave"
            className="bg-amber-400 hover:bg-amber-500 transition text-white font-medium text-lg px-6 py-3 rounded-md shadow-md"
          >
            File a Leave
          </Link>
        </div>

        {/* Quick Info Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Email</h4>
            <p className="text-gray-800">{user?.email}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Department</h4>
            <p className="text-gray-800">{user?.department || "N/A"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Position</h4>
            <p className="text-gray-800">{user?.position || "N/A"}</p>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;
