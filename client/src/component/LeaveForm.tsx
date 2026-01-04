import {useState, type SyntheticEvent} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useStore} from "../services/useStore";
import {useMutation} from "@tanstack/react-query";
import {calculateDays} from "../helper/calculateDays";
import {useNavigate} from "react-router-dom";
import {TailSpin} from "react-loader-spinner";
import axiosInstance from "../services/axiosInstance";
import axios from "axios";

export interface IErrorMessage {
    location?: string;
    type?: string;
    value?: string;
    path?: string;
    msg?: string;
}
const LeaveForm = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [approver, setApprover] = useState("");
    const [leaveType, setLeaveType] = useState("");
    const [reason, setReason] = useState("");
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("");
    const [errorMessage, setErrorMessage] = useState<IErrorMessage | string>("");
    console.log(errorMessage)
    const {user} = useStore();

    const {mutate, isPending} = useMutation({
        mutationKey: ["leaverequest"],
        mutationFn: async (data: {name?: string; leaveType: string}) => {
            try {
                const response = await axiosInstance.post(`/leave`, data);
                console.log(response.data);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    console.log(error.response?.data.messageError);
                    setErrorMessage(error.response?.data.messageError || error.response?.data.messageError);
                } else {
                    setErrorMessage("An unexpected error occurred");
                }
                throw Error;
            }
        },
        onSuccess: () => {
            navigate("/leave/success");
        },
    });
    const duration = fromDate && toDate ? calculateDays(fromDate, toDate) : 0;

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const data = {
            EEID: user?.EEID,
            name: user?.name,
            approver,
            leaveType,
            reason,
            from: fromDate?.toLocaleDateString("en-US", {month: "short", day: "2-digit", year: "numeric"}),
            to: toDate?.toLocaleDateString("en-US", {month: "short", day: "2-digit", year: "numeric"}),
            duration: duration,
        };
        mutate(data);
    };

    const finalDuration = (() => {
        if (duration === 1 && (selectedOption === "First Half" || selectedOption === "Second Half")) {
            return 0.5;
        }
        return duration;
    })();

    // 2. Handle change event
    const handleOptionChange = (e: any) => {
        setSelectedOption(e.target.value);
    };
    return (
        <div className='max-w-4xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            {/* Header */}
            <div className='mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Leave Application</h2>
                <p className='text-sm text-gray-500'>Fill in the details to request leave</p>
            </div>

            {/* Form */}
            <div className='space-y-6'>
                {/* Top Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Employee ID</label>
                        <p className='px-3 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-700 text-sm cursor-not-allowed'>
                            {user?.EEID}
                        </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Name</label>
                        <input
                            disabled
                            value={user?.name}
                            className='px-3 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-700 text-sm cursor-not-allowed'
                            type='text'
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Approver</label>
                        <input
                         style={{borderColor: Array.isArray(errorMessage) && errorMessage?.find((mes: IErrorMessage) => mes?.path === "approver") ? 'red' : ''}}
                            onChange={(e) => setApprover(e.target.value)}
                            className='px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500'
                            type='text'
                            placeholder='Approver email'
                        />
                        <div className='my-1'>
                            {Array.isArray(errorMessage) &&
                                errorMessage?.find((mes: IErrorMessage) => mes?.path === "approver") && (
                                    <p className='text-red-400 font-semibold text-xs'>
                                        {errorMessage.find((err: IErrorMessage) => err?.path === "approver")?.msg}
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Leave Type</label>
                        <select
                         style={{borderColor: Array.isArray(errorMessage) && errorMessage?.find((mes: IErrorMessage) => mes?.path === "leaveType") ? 'red' : ''}}
                            value={leaveType}
                            onChange={(e) => setLeaveType(e.target.value)}
                            className='px-3 py-2 rounded-md border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
                        >
                            <option value='' disabled>
                                Select leave type
                            </option>
                            <option>Vacation Leave</option>
                            <option>Sick Leave</option>
                            <option>Leave without Pay</option>
                            <option>Maternity Leave</option>
                            <option>Paternity Leave</option>
                            <option>Magna Carta</option>
                            <option>Official Business</option>
                            <option>Paternity Leave</option>
                            <option>Paid Time Off</option>
                            <option>Violence Against Women and Children</option>
                            <option>Work from Home</option>
                        </select>
                        <div className='my-1'>
                            {Array.isArray(errorMessage) &&
                                errorMessage?.find((mes: IErrorMessage) => mes?.path === "leaveType") && (
                                    <p className='text-red-400 font-semibold text-xs'>
                                        {errorMessage.find((err: IErrorMessage) => err?.path === "leaveType")?.msg}
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Leave Balance</label>
                        <input
                            className='px-3 py-2 rounded-md border border-gray-200 text-sm'
                            type='text'
                            placeholder={user?.leaveCredits}
                            disabled
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Leave Credits</label>
                        <input
                            className='px-3 py-2 rounded-md border border-gray-200 text-sm'
                            type='text'
                            placeholder={user?.leaveCredits}
                            disabled
                        />
                    </div>
                </div>

                {/* Reason */}
                <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-600'>Reason</label>
                    <textarea
                    style={{borderColor: Array.isArray(errorMessage) && errorMessage?.find((mes: IErrorMessage) => mes?.path === "reason") ? 'red' : ''}}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className='w-full h-32 px-3 py-2 rounded-md border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400'
                        placeholder='Briefly explain your reason...'
                    />
                    <div className='my-1'>
                        {Array.isArray(errorMessage) &&
                            errorMessage?.find((mes: IErrorMessage) => mes?.path === "reason") && (
                                <p className='text-red-400 font-semibold text-xs'>
                                    {errorMessage.find((err: IErrorMessage) => err?.path === "reason")?.msg}
                                </p>
                            )}
                    </div>
                </div>

                {/* Date Section */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>From</label>
                        <DatePicker
                            selected={fromDate}
                            dateFormat='MM/dd/yyyy'
                            onChange={(date: any) => {
                                setFromDate(date);
                            }}
                            className='w-full px-3 py-2 rounded-md border border-gray-200 text-sm'
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Until</label>
                        <DatePicker
                            selected={toDate}
                            minDate={fromDate}
                            dateFormat='MM/dd/yyyy'
                            onChange={(date: any) => {
                                setToDate(date);
                            }}
                            className='w-full px-3 py-2 rounded-md border border-gray-200 text-sm'
                        />
                    </div>

                    <div className='flex flex-col justify-end rounded-md bg-gray-50 border border-gray-200 p-4'>
                        <p className='text-xs text-gray-500'>Duration</p>
                        <p className='text-lg font-semibold text-gray-800'>
                            {finalDuration} {finalDuration === 1 ? "Day" : "Days"}
                        </p>
                    </div>
                </div>
                {duration <= 1 && (
                    <div className='grid grid-cols-3'>
                        <div className='flex items-center gap-1'>
                            <input
                                value='Whole Day'
                                checked={selectedOption === "Whole Day"}
                                onChange={handleOptionChange}
                                type='radio'
                                name=''
                                id='whole_day'
                            />
                            <label htmlFor='whole_day'>Whole Day</label>
                        </div>
                        <div className='flex items-center gap-1'>
                            <input
                                value='First Half'
                                checked={selectedOption === "First Half"}
                                onChange={handleOptionChange}
                                type='radio'
                                name=''
                                id='first_half'
                            />
                            <label htmlFor='first_half'>First Half</label>
                        </div>
                        <div className='flex items-center gap-1'>
                            <input
                                value='Second Half'
                                checked={selectedOption === "Second Half"}
                                onChange={handleOptionChange}
                                type='radio'
                                name=''
                                id='second_half'
                            />
                            <label htmlFor='second_half'>Second Half</label>
                        </div>
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={submitHandler}
                    className='w-full flex cursor-pointer items-center justify-center gap-4 h-9 bg-yellow-600 hover:bg-yellow-700 transition text-white text-sm font-medium py-2.5 rounded-md'
                >
                    {isPending && (
                        <TailSpin
                            visible={true}
                            height='20'
                            width='20'
                            color='#ffff'
                            ariaLabel='tail-spin-loading'
                            radius='1'
                        />
                    )}
                    <span>{isPending ? "Submitting Request..." : "Submit Leave Request"}</span>
                </button>
            </div>
        </div>
    );
};

export default LeaveForm;
