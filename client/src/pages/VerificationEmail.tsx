import { BiCheckCircle } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

const VerificationEmail = () => {
    const location = useLocation();
    const email = location?.state?.email || "";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <BiCheckCircle className="h-14 w-14 text-green-500" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800">
                    Verification Email Sent
                </h2>

                {/* Description */}
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                    We’ve sent a verification link to
                    <span className="block font-semibold text-gray-900 mt-1">
                        {email}
                    </span>
                </p>

                <p className="mt-4 text-sm text-gray-500">
                    The link will expire in <span className="font-medium">10 minutes</span>.  
                    If you don’t see the email, please check your spam folder.
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3">
                    <Link
                        to="/request"
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        Request a new verification link
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex justify-center items-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-yellow-300 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerificationEmail;
