import { useCallback, useEffect, useState } from "react";
import { dummyAttendanceData } from "../assets/assets";
import Loading from "../components/Loading";
import { Calendar, Clock, LogIn } from "lucide-react";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const formatWorkingHours = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex-1 min-w-45 bg-white border border-slate-200 rounded-xl px-6 py-5 flex items-center gap-5">
    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center shrink-0">
      <Icon size={18} strokeWidth={1.5} className="text-slate-500" />
    </div>
    <div>
      <p className="text-sm text-slate-400 mb-0.5">{label}</p>
      <p className="text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clockedIn, setClockedIn] = useState(false);

  const fetchAttendance = useCallback(() => {
    setLoading(true);
    setAttendance(dummyAttendanceData);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  if (loading) return <Loading />;

  const daysPresent = attendance.filter(a => a.status === "PRESENT").length;
  const lateArrivals = attendance.filter(a => {
    const hour = new Date(a.checkIn).getHours();
    return hour >= 10;
  }).length;
  const avgWorkHrs = attendance.length
    ? (attendance.reduce((sum, a) => sum + a.workingHours, 0) / attendance.length).toFixed(1)
    : 0;

  return (
    <div className="flex-1 p-8 relative">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-800">Attendance</h1>
        <p className="text-sm text-slate-400 mt-1">Track your work hours and daily check-ins</p>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard icon={Calendar} label="Days Present" value={daysPresent} />
        <StatCard icon={Clock} label="Late Arrivals" value={lateArrivals} />
        <StatCard icon={Clock} label="Avg. Work Hrs" value={`${avgWorkHrs} Hrs`} />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Date", "Check In", "Check Out", "Working Hours", "Day Type", "Status"].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-slate-400 px-6 py-3 uppercase tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-12 text-sm">No attendance records found.</td>
                </tr>
              ) : (
                attendance.map((record, i) => (
                  <tr key={record._id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === attendance.length - 1 ? "border-none" : ""}`}>
                    <td className="px-6 py-4 text-slate-700 font-medium">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formatTime(record.checkIn)}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formatTime(record.checkOut)}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formatWorkingHours(record.workingHours)}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                        {record.dayType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border
                        ${record.status === "PRESENT"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : "text-red-500 bg-red-50 border-red-100"
                        }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clock In / Out FAB */}
      <button
        onClick={() => setClockedIn(prev => !prev)}
        className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-white transition-all active:scale-[0.97]
          ${clockedIn ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          <LogIn size={16} className={clockedIn ? "rotate-180" : ""} />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold leading-tight">{clockedIn ? "Clock Out" : "Clock In"}</p>
          <p className="text-xs text-white/70">{clockedIn ? "end your work day" : "start your work day"}</p>
        </div>
      </button>

    </div>
  );
};

export default Attendance;