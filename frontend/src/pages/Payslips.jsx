import { useCallback, useEffect, useState } from "react";
import Loading from './../components/Loading';
import { PlusIcon } from "lucide-react";
import PaySlipList from "../components/payslip/PaySlipList";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";
import {useAuth} from '../context/AuthContext'
import api from "../api/axios.js";
import { toast } from 'react-hot-toast';

const Payslips = () => {
    const [paySlips, setPaySlips] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth()
    const isAdmin = user?.role === 'ADMIN'

    const fetchPaySlips = useCallback(async()=> {
        try {
           const res = await api.get('/payslips')
           setPaySlips(res.data.data || [])
        } catch (error) {
            toast.error(error?.response?.data.error || error.message)
        }
        setLoading(false)
    },[])

    useEffect(() => {
        fetchPaySlips()
    },[fetchPaySlips])

    useEffect(() => {
    if(isAdmin) api.get('/employees')
        .then((res) => {
            const list = res.data.data || res.data  // handle both response shapes
            setEmployees(list.filter((e) => !e.isDeleted))
        })
        .catch(()=>{})
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