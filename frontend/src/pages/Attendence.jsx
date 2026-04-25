import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Calendar, Clock, LogIn } from "lucide-react";
import api from './../api/axios.js';
import { toast } from 'react-hot-toast';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatTime = (iso) => {
  if (!iso) return "—"; // ✅ handle null checkOut
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const formatWorkingHours = (hours) => {
  if (!hours) return "—"; // ✅ handle 0 or null
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

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
  const [clockLoading, setClockLoading] = useState(false); //loading for clock button

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await api.get('/attendance/session') //correct endpoint
      const json = res.data
      setAttendance(json.data || [])

      //fixed typo: emoloyee → employee
      //check if today's record exists and has no checkOut → means clocked in
      const todayRecord = json.data?.find(a => {
        const recordDate = new Date(a.date).toDateString()
        const today = new Date().toDateString()
        return recordDate === today
      })
      setClockedIn(!!todayRecord && !todayRecord.checkOut) //true only if checked in but not out

    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  //Real API call for clock in/out
  const handleClockInOut = async () => {
    setClockLoading(true)
    try {
      const res = await api.post('/attendance')
      const { type, data } = res.data

      if (type === "CHECK_IN") {
        toast.success("Clocked in successfully!")
        setClockedIn(true)
        setAttendance(prev => [data, ...prev]) //prepend new record
      } else if (type === "CHECK_OUT") {
        toast.success("Clocked out successfully!")
        setClockedIn(false)
        // ✅ update the existing record in state
        setAttendance(prev =>
          prev.map(a => a._id === data._id ? data : a)
        )
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setClockLoading(false)
    }
  }

  if (loading) return <Loading />;

  const daysPresent = attendance.filter(a => a.status === "PRESENT").length;
  const lateArrivals = attendance.filter(a => {
    const hour = new Date(a.checkIn).getHours();
    return hour >= 10;
  }).length;
  const avgWorkHrs = attendance.length
    ? (attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0) / attendance.length).toFixed(1)
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
                  <td colSpan={6} className="text-center text-slate-400 py-12 text-sm">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((record, i) => (
                  <tr
                    key={record._id}
                    className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === attendance.length - 1 ? "border-none" : ""}`}
                  >
                    <td className="px-6 py-4 text-slate-700 font-medium">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formatTime(record.checkIn)}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formatTime(record.checkOut)}</td> {/* ✅ null safe */}
                    <td className="px-6 py-4 text-slate-600 font-medium">{formatWorkingHours(record.workingHours)}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                        {record.dayType || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border
                        ${record.status === "PRESENT"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : record.status === "LATE"
                            ? "text-amber-600 bg-amber-50 border-amber-100" //LATE status style
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
        onClick={handleClockInOut} //real API call
        disabled={clockLoading}
        className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-white transition-all active:scale-[0.97] disabled:opacity-70
          ${clockedIn ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          {clockLoading
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <LogIn size={16} className={clockedIn ? "rotate-180" : ""} />
          }
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold leading-tight">{clockedIn ? "Clock Out" : "Clock In"}</p>
          <p className="text-xs text-white/70">{clockedIn ? "End your work day" : "Start your work day"}</p>
        </div>
      </button>

    </div>
  );
};

export default Attendance;