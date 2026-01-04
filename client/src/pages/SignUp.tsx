import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {RotatingLines} from "react-loader-spinner";
import {useDebounce} from "../hooks/useDebounce"; // adjust path if needed
import axiosInstance from "../services/axiosInstance";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export interface IErrorMessage {
    location?: string;
    type?: string;
    value?: string;
    path?: string;
    msg?: string;
}

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<IErrorMessage[] | string>("");

    // 🔹 Debounced email
    const debouncedEmail = useDebounce(email, 500);

    // 🔹 React Query (runs when debouncedEmail changes)
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const {
        data: checkEmail,
        isFetching,
        isSuccess,
    }: any = useQuery({
        queryKey: ["checkname", debouncedEmail],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(`/employee/${email}`);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    console.log(error.response?.data.messageError);
                    setErrorMessage(error.response?.data.messageError || error.response?.data.message);
                } else {
                    setErrorMessage("An unexpected error occurred");
                }
                throw Error;
            }
        },
        enabled: !!debouncedEmail && isValidEmail(debouncedEmail),

    });
      console.log(checkEmail)

    const {mutate}: any = useMutation({
        mutationKey: ["sendreset"],
        mutationFn: async (email) => {
            try {
                const response = await axios.post(`http://localhost:5000/employee/email-verification`, email);
                return response;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    console.log(error.response?.data.messageError);
                    setErrorMessage(error.response?.data.messageError || error.response?.data.message);
                } else {
                    setErrorMessage("An unexpected error occurred");
                }
                throw Error;
            }
        },
        onSuccess: (statusData: any) => {
            console.log("success reqw", statusData);
            // if(statusData?.statusText === 'OK' && statusData?.data?.email){
            navigate("/verify-email", {state: {type: "verify", email: statusData?.data?.email}});
            //}
        },
    });

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
            <div className='w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-3xl font-bold'>Register an Account</h2>
                    <img src='../src/assets/diy-logo.png' className='h-10' alt='' />
                </div>

                <form>
                    <div className='flex flex-col mb-3'>
                        <label htmlFor='email'>Enter your Email</label>
                        <div className="border border-[#dddd] rounded-sm p-2 flex items-center justify-between">
                          <input
                            id='email'
                            type='text'
                            placeholder='juan@mrdiy.com'
                            value={email}
                            onChange={(e) => {
                                const value = e.target.value;
                                setEmail(value);

                                if (value && !isValidEmail(value) && !debouncedEmail) {
                                    setErrorMessage("Please enter a valid email address.");
                                } else {
                                    setErrorMessage("");
                                }
                            }}
                            className='w-full outline-none border-none'
                        />
                         {(checkEmail && !isFetching) && (
                            <FaCheck className="w-4 h-4 text-green-500"/>
                        ) }
                         {(!checkEmail && !isFetching && email) && (
                            <FaXmark className="w-4 h-4 text-red-500"/>
                        ) }
                        
                        </div>

                        {isFetching && (
                            <div className='mt-1'>
                                <RotatingLines
                                    visible={true}
                                    height='25'
                                    width='25'
                                    color='grey'
                                    strokeWidth='5'
                                    animationDuration='0.75'
                                    ariaLabel='rotating-lines-loading'
                                />
                            </div>
                        )}
                    </div>

                    <div className='my-1'>
                        {Array.isArray(errorMessage) &&
                            !isFetching &&
                            errorMessage?.find((mes: IErrorMessage) => mes?.path === "email") && (
                                <p className='text-red-400 font-semibold text-xs'>
                                    {errorMessage.find((err: IErrorMessage) => err?.path === "email")?.msg}
                                </p>
                            )}
                        {typeof errorMessage === "string" && (
                            <p className='text-red-400 font-semibold text-xs'>{errorMessage}</p>
                        )}
                        {checkEmail && (
                            <p className='text-green-400 font-semibold text-xs'>We found your email, please click the button below to verify</p>
                        )}
                    </div>
                    {/* {isSuccess && checkEmail && <p className='text-green-400'>We found your email please verify</p>} */}
                    <p className='text-sm italic mt-2'>
                        Note: Please make sure to enter the email address you provided during your onboarding process.
                        This will help us verify your account correctly and ensure that your information matches our
                        records.
                    </p>
                      <div className='my-4'>
                    <p className='text-sm font-bold'>
                        Have an account? sign in{" "}
                        <Link className='underline text-sm text-blue-500' to={"/signin"}>
                            here
                        </Link>
                    </p>
                </div>
                    <button
                        type='submit'
                        onClick={(e: React.SyntheticEvent) => {
                            e.preventDefault();
                            mutate({email: email});
                        }}
                        className='bg-[#ffc20e] p-2 w-full mt-2 rounded-md cursor-pointer disabled:opacity-50'
                    >
                        Verify Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
