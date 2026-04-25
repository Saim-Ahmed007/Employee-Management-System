import { CalendarIcon, FileTextIcon, DollarSign, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="flex-1 min-w-45 bg-white border border-slate-200 rounded-xl px-6 py-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-slate-800">{value}</p>
    </div>
    <Icon size={36} strokeWidth={1.2} className="text-slate-600" />
  </div>
);
const EmployeeDashboard = ({data}) => {
    const { currentMonthAttendance, pendingLeaves, latestPayslip, employee } = data;
    const subtitle = `${employee.position} - ${employee.department}`;
    const salary = latestPayslip ? `$${latestPayslip.netSalary.toLocaleString()}` : "N/A";
    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome, {employee.firstName}!
        </h1>
        <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard
          label="Days Present"
          value={currentMonthAttendance}
          icon={CalendarIcon}
        />
        <StatCard
          label="Pending Leaves"
          value={pendingLeaves}
          icon={FileTextIcon}
        />
        <StatCard label="Latest Payslip" value={salary} icon={DollarSign} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link to="/attendance" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all">
          Mark Attendance
          <ArrowRight size={15} />
        </Link>
        <Link to="/leave" className="text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-100 active:scale-[0.98] px-5 py-2.5 rounded-lg transition-all">
          Apply for Leave
        </Link>
      </div>
    </div>
    );
};

export default EmployeeDashboard;