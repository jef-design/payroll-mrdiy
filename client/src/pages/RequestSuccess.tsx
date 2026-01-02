import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const RequestSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaCheck className="h-16 w-16 text-green-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Leave Request Submitted
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">
          Your leave application has been successfully sent and is now pending
          approval from your approver.
        </p>

        {/* Status box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium">
            Status: Pending Approval
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            You will be notified once your approver reviews your request.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
          to={`/employee/profile`}
            className="w-full bg-yellow-600 hover:bg-yellow-700 transition text-white text-sm font-medium py-2.5 rounded-md"
            
          >
            Go to Dashboard
          </Link>

          <button
            className="w-full border border-gray-300 hover:bg-gray-100 transition text-gray-700 text-sm font-medium py-2.5 rounded-md"
            onClick={() => window.location.href = "/leave-history"}
          >
            View My Leave Requests
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6">
          If you have questions, please contact your HR department.
        </p>
      </div>
    </div>
  );
};

export default RequestSuccess;
