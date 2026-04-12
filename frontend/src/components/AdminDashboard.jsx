import { UsersIcon, Building2Icon, CalendarIcon, FileTextIcon } from "lucide-react";

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

const AdminDashboard = ({ data }) => {
  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back, Admin — here's your overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4">
        <StatCard
          label="Total Employees"
          value={data.totalEmployees}
          icon={UsersIcon}
        />
        <StatCard
          label="Departments"
          value={data.totalDepartments}
          icon={Building2Icon}
        />
        <StatCard
          label="Today's Attendance"
          value={data.todayAttendance}
          icon={CalendarIcon}
        />
        <StatCard
          label="Pending Leaves"
          value={data.pendingLeaves}
          icon={FileTextIcon}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
