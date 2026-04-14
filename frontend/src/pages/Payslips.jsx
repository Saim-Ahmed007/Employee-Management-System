import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Loading from './../components/Loading';
import { PlusIcon } from "lucide-react";
import PaySlipList from "../components/payslip/PaySlipList";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";

const Payslips = () => {
    const [paySlips, setPaySlips] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const isAdmin = true

    const fetchPaySlips = useCallback(async()=> {
        setPaySlips(dummyPayslipData)
        setTimeout(()=> {
            setLoading(false)
        },1000)
    },[])

    useEffect(() => {
        fetchPaySlips()
    },[fetchPaySlips])

    useEffect(() => {
        if(isAdmin) setEmployees(dummyEmployeeData)
    },[isAdmin])

    if(loading) return <Loading/>

    return (
        <div className="animate-fade-in p-8 ">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-medium mb-1">Payslips</h1>
                    <p className="text-sm text-slate-500">{isAdmin ? "Generate and manage employee payslips": "Your payslip history"}</p>
                </div>
                {isAdmin && <GeneratePayslipForm employees={employees} onSuccess={fetchPaySlips}/>}
            </div>

            <p className="mb-8">Payslip List</p>

            <PaySlipList isAdmin={isAdmin} paySlips={paySlips}/>
            
        </div>
    );
};

export default Payslips;