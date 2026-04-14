import {format} from "date-fns";
import {DownloadIcon} from 'lucide-react'

const PaySlipList = ({isAdmin, paySlips}) => {

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {isAdmin && (
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 tracking-wide uppercase">
                Employee
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 tracking-wide uppercase">
              Period
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 tracking-wide uppercase">
              Basic Salary
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 tracking-wide uppercase">
              Net Salary
            </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 tracking-wide uppercase">
                Action
              </th>
        
          </tr>
        </thead>
        <tbody>
          {paySlips.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 5 : 4}
                className="text-center text-slate-400 py-12 text-sm"
              >
                No payslips found.
              </td>
            </tr>
          ) : (
            paySlips.map((payslip, i) => (
              <tr
                key={payslip._id}
                className={`hover:bg-slate-50 transition-colors ${
                  i < paySlips.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {isAdmin && (
                  <td className="px-4 py-3 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {payslip.employee.firstName} {payslip.employee.lastName}
                  </td>
                )}

                <td className="px-4 py-3 text-sm font-medium text-slate-700 whitespace-nowrap">
                 {format(new Date(payslip.year, payslip.month -1), "MMMM yyyy")}
                </td>

                <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                  ${payslip.basicSalary?.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-sm text-slate-700 max-w-50 truncate">
                  ${payslip.netSalary?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  <button onClick={()=> window.open(`/print/payslips/${payslip._id || payslip.id}`)} className="inline-flex items-center px-2 py-1 text-blue-500 bg-slate-200 text-sm font-medium rounded  transition-colors">
                    <DownloadIcon className="w-3 h-3 mr-1.5"/> Download 
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    );
};

export default PaySlipList;