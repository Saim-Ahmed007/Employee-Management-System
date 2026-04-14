import { useCallback, useEffect, useState } from "react";
import { dummyLeaveData } from "../assets/assets";
import Loading from './../components/Loading';
import { PlusIcon, ThermometerIcon, TreePalmIcon, UmbrellaIcon } from "lucide-react"
import LeaveHistory from "../components/leave/LeaveHistory";
import ApplyLeaveModal from "../components/leave/ApplyLeaveModal";


const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const isAdmin = false

    const fetchLeaves = useCallback(() => {
        setLeaves(dummyLeaveData)
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        // Fetch leaves from the server and update state
    }, []);
    useEffect(()=> {
        fetchLeaves();
    },[fetchLeaves])

    if(loading) return <Loading/>

    const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
    const sickCount = leaves.filter((l) => l.type === "SICK").length;
    const casualCount = leaves.filter((l) => l.type === "CASUAL").length;
    const annualCount = leaves.filter((l) => l.type === "ANNUAL").length;

    const leaveStats = [
        {label: 'Sick Leave', value: sickCount, icon: ThermometerIcon},
        {label: 'Casual Leave', value: casualCount, icon: UmbrellaIcon},
        {label: 'Annual Leave', value: annualCount, icon: TreePalmIcon},
    ]

    return (
        <div className="animate-fade-in p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-medium mb-1">Leave Management</h1>
                    <p className="text-sm text-slate-500">{isAdmin ? 'Manage leave applications': 'Your leave history and requests'}</p>
                </div>
                {!isAdmin && !isDeleted &&(
                    <button onClick={()=> setShowModal(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                        <PlusIcon onClick={()=> setShowModal(true)} className="w-4 h-4"/>Apply for leave
                    </button>
                )}
            </div>
            {!isAdmin && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
                    {leaveStats.map((s) => (
                       <div key={s.label} className="bg-white p-4 rounded-lg shadow flex items-center gap-4 ">
                            <s.icon className="w-8 h-8 text-slate-600 p-1" />
                            <div>
                                <h3 className="font-medium text-sm text-slate-600">{s.label}</h3>
                                <p className="text-xl font-bold">{s.value} <span className="font-medium text-sm text-slate-600">taken</span> </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

                <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
                <ApplyLeaveModal open={showModal} onClose={() => setShowModal(false)} 
                onSuccess={fetchLeaves} />
        
            
        </div>
    );
};

export default Leave;