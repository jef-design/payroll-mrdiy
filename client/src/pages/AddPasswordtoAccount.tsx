import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {TailSpin} from "react-loader-spinner";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

const AddPasswordtoAccount = () => {
    const [changePassword, setchangePassword] = useState("");
    const [searchParams] = useSearchParams();
    const [showPass, setShowPass] = useState(false);
    const [message, setMessage] = useState("");

    const [loadingToken, setloadingToken] = useState(false);
    const [statusReset, setStatusReset] = useState(false);

    const accessToken = searchParams.get("access");

    // useEffect(() => {
    //     if (resetToken) {
    //         setloadingToken(true);
    //         axios
    //             .get(`/user/profile/password/${resetToken}`)
    //             .then((res) => {
    //                 setMessage(res.data.message);
    //                 console.log(res.data);
    //                 setloadingToken(false);
    //             })
    //             .catch((err) => {
    //                 setMessage(err.response?.data?.message);
    //                 setloadingToken(false);
    //             });
    //     }
    // }, []);
    const {mutate, isPending} = useMutation({
        mutationKey: ["addpassword"],
        mutationFn: async (password: {newPassword: string}) => {
            try {
                const response = await axios.patch(
                    `http://localhost:5000/employee/update/password/${accessToken}`,
                    password
                );
                return response;
            } catch (error) {
                return error;
            }
        },
        onSuccess: (statusData: any) => {
            // console.log("success changePassword", statusData);
            setMessage(statusData?.statusText);
            // navigate('/check-email',{state: {type: 'reset',email: statusData?.data?.email}})
            setStatusReset(true);
        },
    });
    return (
        <div>
            <div className="mx-auto max-w-5xl p-2 mt-5">
                <div className='mb-4'>
                    <h2 className='text-3xl font-bold'>Enter your New password</h2>
                </div>
                <div>
                    You can now change your password, password must be 6 - 12 characters.
                    <div className='rounded-md mb-4 border flex bg-background justify-between items-center gap-1 px-1'>
                        <input
                            value={changePassword}
                            onChange={(e) => setchangePassword(e.target.value)}
                            placeholder='Enter Password'
                            maxLength={12}
                            className='block border-none outline-none mt-3 p-2 rounded-md w-full'
                            type={showPass ? "text" : "password"}
                        />
                        {showPass ? (
                            <IoMdEye className='text-xl cursor-pointer' onClick={() => setShowPass(false)} />
                        ) : (
                            <IoMdEyeOff className='text-xl cursor-pointer' onClick={() => setShowPass(true)} />
                        )}
                    </div>

                    {/* <div className='rounded-md border flex bg-background justify-between items-center gap-1 px-1'>
                        <input
                            value={changePassword}
                            onChange={(e) => setchangePassword(e.target.value)}
                            placeholder='Confirm Password'
                            maxLength={12}
                            className='block border-none outline-none mt-3 p-2 rounded-md w-full'
                            type={showPass ? "text" : "password"}
                        />
                        {showPass ? (
                            <IoMdEye className='text-xl cursor-pointer' onClick={() => setShowPass(false)} />
                        ) : (
                            <IoMdEyeOff className='text-xl cursor-pointer' onClick={() => setShowPass(true)} />
                        )}
                    </div> */}
                    <button
                        onClick={() => mutate({newPassword: changePassword})}
                        disabled={!changePassword || changePassword?.length < 6}
                        className=' w-full my-2 bg-[#ffc20e] p-4  mt-2 rounded-md cursor-pointer disabled:opacity-50'
                    >
                        {isPending ? (
                            <TailSpin
                                visible={true}
                                height='25'
                                width='25'
                                color='#ffff'
                                ariaLabel='tail-spin-loading'
                                radius='1'
                            />
                        ) : (
                            "Change Password"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPasswordtoAccount;
