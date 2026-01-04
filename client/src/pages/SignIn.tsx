import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {RotatingLines} from "react-loader-spinner";
import {useStore} from "../services/useStore";
import axiosInstance from "../services/axiosInstance";
import axios from "axios";

export interface IErrorMessage {
     location?: string;
    type?: string;
    value?: string;
    path?: string;
    msg?: string;
}

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<IErrorMessage | string>("");
   
    const {setLogInUser} = useStore();

    const {mutate, isPending}: any = useMutation({
        mutationKey: ["signin"],
        mutationFn: async (data) => {
            try {
                
                const response = await axiosInstance.post(`/employee/signin`, data);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    console.log(error.response?.data.messageError)
                    setErrorMessage(error.response?.data.messageError || error.response?.data.message);
                } else {
                    setErrorMessage("An unexpected error occurred");
                }
                throw Error;
            }
        },
        onSuccess: (statusData) => {
            console.log(statusData);
            setLogInUser(statusData?.user);
            navigate("/employee/profile");
        },
    });

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
            <div className='w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
                {/* Logo */}
                <div className='flex justify-center mb-6'>
                    <img src='../src/assets/diy-logo.png' className='h-12' alt='DIY Logo' />
                </div>

                {/* Title */}
                <h2 className='text-2xl font-semibold text-center text-gray-800 mb-1'>Sign in to your account</h2>
                <p className='text-sm text-center text-gray-500 mb-6'>Welcome! Happy Mr DIY</p>

                {/* Form */}
                <form>
                    <div className='mb-4'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-600 mb-1'>
                            Email address
                        </label>
                        <input
                            id='email'
                            type='email'
                            placeholder='juan@mrdiy.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500'
                        />
                        <div className='my-1'>
                            {Array.isArray(errorMessage) &&
                                errorMessage?.find((mes: IErrorMessage) => mes?.path === "email") && (
                                    <p className='text-red-400 font-semibold text-xs'>
                                        {errorMessage.find((err: IErrorMessage) => err?.path === "email")?.msg}
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-600 mb-1'>
                            Password
                        </label>
                        <input
                            id='password'
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500'
                        />
                         <div className='my-1'>
                            {Array.isArray(errorMessage) &&
                                errorMessage?.find((mes: IErrorMessage) => mes?.path === "password") && (
                                    <p className='text-red-400 font-semibold text-xs'>
                                        {errorMessage.find((err: IErrorMessage) => err?.path === "password")?.msg}
                                    </p>
                                )}
                        </div>
                    </div>

                    {/* Loader */}
                    {isPending && (
                        <div className='flex justify-center mb-3'>
                            <RotatingLines
                                visible={true}
                                height='24'
                                width='24'
                                color='gray'
                                strokeWidth='5'
                                animationDuration='0.75'
                                ariaLabel='loading'
                            />
                        </div>
                    )}

                    {/* Error */}
                    {typeof errorMessage === "string" && errorMessage && (
                        <p className='text-sm text-red-500 mb-3 text-center'>{errorMessage}</p>
                    )}

                    {/* Button */}
                    <button
                        type='submit'
                        disabled={!email || isPending}
                        onClick={(e) => {
                            e.preventDefault();
                            mutate({email, password});
                        }}
                        className='w-full bg-yellow-600 hover:bg-yellow-700 transition text-white text-sm font-medium py-2.5 rounded-md disabled:opacity-50'
                    >
                        Sign In
                    </button>
                </form>
                <div className='my-4'>
                    <p className='text-sm'>
                        Don't have an account? sign up{" "}
                        <Link className='underline text-sm text-blue-500' to={"/signup"}>
                            here
                        </Link>
                    </p>
                </div>
                {/* Footer */}
                <p className='text-xs text-gray-400 text-center mt-6'>
                    © {new Date().getFullYear()} MR DIY Employee Portal
                </p>
            </div>
        </div>
    );
};

export default SignIn;
