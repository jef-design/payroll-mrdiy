import { Link, useLocation } from "react-router-dom";

const VerificationEmail = () => {
     const location = useLocation();
    // const [searchParams, setSearchParams] = useSearchParams();
    const email = location?.state?.email || "";
    const type = location?.state?.type || "";


    return (
        <div className='mx-auto max-w-5xl p-2 mt-5'>
            <div>
                <h2 className='text-3xl font-bold'>Verification link sent</h2>
                <div className='mt-3'>
                     <Link
                to={"/"}
                className='font-extrabold tracking-wider text-xl w-fit text-primary flex items-center gap-1 mb-3'
            >
               
            </Link>
        
                <div>
                    
                    <div className='mt-3'>
                        We've emailed you at {email}, a verification email link, which will expire in 10
                        minutes. If you don't see it, please check your spam folder or request a new link{" "}
                        <Link to={"/request"} className='underline text-blue-500'>
                            here
                        </Link>
                        .
                    </div>
                </div>
         
                   </div>
            </div>
        </div>
    );
};

export default VerificationEmail;
