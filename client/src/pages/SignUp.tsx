import {useState} from "react";
import { useNavigate } from "react-router-dom";

export interface IErrorMessage {
    location?: string;
    type?: string;
    value?: string;
    path?: string;
    msg?: string;
}
const SignUp = () => {
  const nav = useNavigate()
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<IErrorMessage[] | string>([]);
    
   const submitHandler = async (e: any) => {
  e.preventDefault();
  nav('/verify-email')

  try {
    const res = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      credentials: 'include', 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email}),
    });

    const data = await res.json();
    console.log(res);

    if (!res.ok) {
      if (data.messageError) {
        // Express Validator errors
        setErrorMessage(data.messageError);
      } else if (data.message) {
        // Custom backend message
        setErrorMessage(data.message);
      } else {
        // Fallback generic error
       // setErrorMessage(["Something went wrong"]);
      }
      return;
    }

    // Success
    setErrorMessage([]);
    setEmail("");
    nav('/')
    

  } catch (error) {
    console.error("Error:", error);
   // setErrorMessage(["Unable to connect to server"]);
  }
};
// Helper: get error message for a specific field
  const getError = (field: string) => {
    if (Array.isArray(errorMessage)) {
      return errorMessage.find((err) => err.path === field)?.msg || "";
    }
    return "";
  };
    return (
        <div className='mx-auto max-w-5xl p-2 mt-5'>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">
            Register an Account
          </h2>
          <div>
            <img src="../src/assets/diy-logo.png" className="h-10" alt="" />
          </div>
          </div>
            <form action='' onSubmit={submitHandler}>
                <div className='flex flex-col mb-3'>
                    <label htmlFor='email'>Enter your Email</label>
                    <input
                        value={email}
                        className='border border-[#dddd] rounded-sm p-2'
                        onChange={(e) => setEmail(e.target.value)}
                        type='text'
                        name=''
                        id='email'
                    />
                </div>
                <p className="text-sm">Note: Please make sure to enter the email address you provided during your onboarding process. This will help us verify your account correctly and ensure that your information matches our records.</p>
                   {getError("user") && (
            <p className="text-red-400 font-semibold text-xs">{getError("user")}</p>
          )}         
                <button

                 className='bg-[#ffc20e] p-2 w-full mt-2 rounded-md cursor-pointer' onClick={(e) => submitHandler(e)}>
                    Verify Email
                </button>
                <p className="text-sm text-red-400">{typeof errorMessage === 'string' && errorMessage}</p>
            </form>
        </div>
    );
};
export default SignUp;
