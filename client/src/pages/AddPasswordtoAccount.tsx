import {useMutation, useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {TailSpin} from "react-loader-spinner";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useStore} from "../services/useStore";
import axiosInstance from "../services/axiosInstance";
import axios from "axios";
import {BsExclamationCircle} from "react-icons/bs";

const AddPasswordtoAccount = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const accessToken = searchParams.get("access");
    console.log(error);
    const {setLogInUser} = useStore();
    const navigate = useNavigate();

    const {data} = useQuery({
        queryKey: ["accesstoken"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(`/employee/password/${accessToken}`);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    console.log(error.response?.data.messageError);
                    setError(error.response?.data.messageError || error.response?.data.message);
                } else {
                    setError("An unexpected error occurred");
                }
                throw Error;
            }
        },
    });

    const {mutate, isPending} = useMutation({
        mutationKey: ["addpassword"],
        mutationFn: async (payload: {newPassword: string}) => {
            const response = await axiosInstance.patch(`/employee/update/password/${accessToken}`, payload);
            return response;
        },
        onSuccess: (res: any) => {
            setLogInUser(res.data?.user);
            navigate("/employee/profile");
        },
        onError: () => {
            setError("Something went wrong. Please try again.");
        },
    });

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        mutate({newPassword: password});
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
            <div className='w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-8'>
                {error === "Invalid or expired token" ? (
                    <div className=''>
                        <div className=''>
                            {/* Icon */}
                            <div className='flex justify-center mb-4'>
                                <BsExclamationCircle className='h-14 w-14 text-red-500' />
                            </div>

                            {/* Title */}
                            <h2 className='text-2xl text-center font-bold text-gray-800'>Link Expired</h2>

                            {/* Message */}
                            <p className='mt-3 text-sm text-gray-600 leading-relaxed'>
                                This verification link has expired or is no longer valid. For your security, links are
                                only active for a limited time.
                            </p>

                            {/* <p className='mt-3 text-sm text-gray-500'>
                                Please request a new verification link to continue.
                            </p> */}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Header */}
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Email Verified</h2>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Set Your Password</h2>
                        <p className='text-sm text-gray-500 mb-6'>
                            Your password must be between <span className='font-medium'>6–12 characters</span>.
                        </p>

                        {/* Password Input */}
                        <div className='space-y-4'>
                            <div className='relative'>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='New password'
                                    maxLength={12}
                                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none'
                                />
                                <span
                                    className='absolute right-3 top-2.5 cursor-pointer text-gray-500'
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? <IoMdEye /> : <IoMdEyeOff />}
                                </span>
                            </div>

                            {/* Confirm Password */}
                            <div className='relative'>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm password'
                                    maxLength={12}
                                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none'
                                />
                                <span
                                    className='absolute right-3 top-2.5 cursor-pointer text-gray-500'
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? <IoMdEye /> : <IoMdEyeOff />}
                                </span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && <p className='mt-3 text-xs font-medium text-red-500'>{error}</p>}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!password || password.length < 6 || isPending}
                            className='mt-6 w-full rounded-md bg-yellow-400 py-2 text-sm font-semibold text-gray-900 hover:bg-yellow-300 transition disabled:opacity-50 flex justify-center'
                        >
                            {isPending ? <TailSpin height={22} width={22} color='#000' /> : "Save Password"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddPasswordtoAccount;
