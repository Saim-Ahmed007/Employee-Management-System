import React, { useState } from "react";
import api from './../../api/axios.js';
import toast from "react-hot-toast";

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
  const [processing, setProcessing] = useState(null);

  const handleStatusUpdate = async(id, status) => {
    setProcessing(id);
    try {
      await api.patch(`/leave/${id}`, {status})
      onUpdate()
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally{
      setProcessing(null)
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {isAdmin && (
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 tracking-wide uppercase">
                Employee
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 tracking-wide uppercase">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 tracking-wide uppercase">
              Dates
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 tracking-wide uppercase">
              Reason
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 tracking-wide uppercase">
              Status
            </th>
            {isAdmin && (
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 tracking-wide uppercase">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 6 : 4}
                className="text-center text-slate-400 py-12 text-sm"
              >
                No leave records found.
              </td>
            </tr>
          ) : (
            leaves.map((record, i) => (
              <tr
                key={record._id}
                className={`hover:bg-slate-50 transition-colors ${
                  i < leaves.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {isAdmin && (
                  <td className="px-4 py-3 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {record.employee.firstName} {record.employee.lastName}
                  </td>
                )}

                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide uppercase
                  ${
                    record.type === "ANNUAL"
                      ? "bg-blue-50 text-blue-600"
                      : record.type === "SICK"
                        ? "bg-red-50 text-red-500"
                        : "bg-slate-100 text-slate-500"
                  }`}
                  >
                    {record.type}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(record.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  {" — "}
                  {new Date(record.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>

                <td className="px-4 py-3 text-xs text-slate-500 max-w-50 truncate">
                  {record.reason}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide uppercase
                  ${
                    record.status === "APPROVED"
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : record.status === "REJECTED"
                        ? "bg-red-50 text-red-500 border border-red-200"
                        : "bg-amber-50 text-amber-500 border border-amber-200"
                  }`}
                  >
                    {record.status}
                  </span>
                </td>

                {isAdmin && (
                  <td className="px-4 py-3">
                    {record.status === "PENDING" ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStatusUpdate(record._id, "APPROVED")} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-green-100 text-green-500 border border-green-200 transition-colors cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button onClick={() => handleStatusUpdate(record._id, "REJECTED")}  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 border border-red-200 transition-colors cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;
