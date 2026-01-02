import { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RotatingLines } from "react-loader-spinner";
import { useDebounce } from "../hooks/useDebounce"; // adjust path if needed

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

 const {data: checkEmail, isFetching, isSuccess}: any = useQuery({
        queryKey: ["checkname", debouncedEmail],
        queryFn: async () => {
            try {
                const response = await axios.get(`http://localhost:5000/employee/${email}`);
                return response;
            } catch (error) {
                return error;
            }
        },
        enabled: !!debouncedEmail,
    });
  

   const {mutate}: any = useMutation({
        mutationKey: ["sendreset"],
        mutationFn: async (email) => {
            try {
                const response = await axios.post(`http://localhost:5000/employee/email-verification`, email);
                return response;
            } catch (error) {
                return error;
            }
        },
        onSuccess: (statusData:any) => {
            console.log("success reqw", statusData);
            // if(statusData?.statusText === 'OK' && statusData?.data?.email){
                navigate('/verify-email',{state: {type: 'verify',email: statusData?.data?.email}})
            //}
        },
    });
 

  return (
    <div className="mx-auto max-w-5xl p-2 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Register an Account</h2>
        <img src="../src/assets/diy-logo.png" className="h-10" alt="" />
      </div>

      <form>
        <div className="flex flex-col mb-3">
          <label htmlFor="email">Enter your Email</label>
          <input
            id="email"
            type="text"
            placeholder="juan@mrdiy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#dddd] rounded-sm p-2"
          />

          {isFetching && (
            <div className="mt-1">
              <RotatingLines
                visible={true}
                height="25"
                width="25"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          )}
        </div>

        {typeof errorMessage === "string" && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}
        <span className="text-red-400 text-xs">{!checkEmail ? 'Employee email not found. Please contact HR or onboarding team.' : ''}</span>
        {isSuccess && checkEmail && (<p className="text-green-400">We found your email please verify</p>)}
        <p className="text-sm italic mt-2">
          Note: Please make sure to enter the email address you provided during
          your onboarding process. This will help us verify your account
          correctly and ensure that your information matches our records.
        </p>
        <button
          type="submit"
          disabled={!isSuccess || isFetching}
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault()
            mutate({email: email})
          }}
          className="bg-[#ffc20e] p-2 w-full mt-2 rounded-md cursor-pointer disabled:opacity-50"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default SignUp;
