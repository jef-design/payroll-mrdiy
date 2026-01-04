import { useEffect, useState } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../services/axiosInstance"
import { LeaveStatusBadge } from "../component/LeaveStatusBadge"

interface LeaveRequest {
  id: number
  leaveType: string
  fromDate: string
  toDate: string
  duration: number
  status: "PENDING" | "APPROVED" | "DECLINED"
  createdAt: string
}

const FILTERS = ["all", "pending", "approved", "declined"] as const

export default function LeaveLists() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all")

  const {data, isFetching} = useQuery({
    queryKey: ['getleaves', filter],
    queryFn: async () => {
        const responses = await axiosInstance.get(`/leave?status=${filter}`)
      return responses.data
    }
  })

  return (
    <div className="max-w-4xl mx-auto mt-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Leave Request History
        </h2>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2">
          {FILTERS.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full cursor-pointer uppercase text-sm font-medium transition
                ${
                  filter === status
                    ? "bg-amber-500 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="py-3 px-2">Date Filed</th>
              <th className="py-3 px-2">Leave Type</th>
              <th className="py-3 px-2">From</th>
              <th className="py-3 px-2">Until</th>
              <th className="py-3 px-2">Days</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {isFetching && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Loading leave history...
                </td>
              </tr>
            )}

            {!isFetching && data?.leave?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No leave requests found
                </td>
              </tr>
            )}

            {data?.leave?.map((leave:any) => (
                <tr
                  key={leave.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {new Date(leave.createdAt).toLocaleDateString('en-US', {
                      month: 'short',day: "2-digit", year: "numeric"
                    })}
                  </td>
                  <td className="py-3 px-2 text-sm font-medium text-gray-800">
                    {leave.leave_type}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {new Date(leave.from).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {new Date(leave.to).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {leave.duration}
                  </td>
                  <td className="py-3 px-2 uppercase">
                    <LeaveStatusBadge status={leave.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
