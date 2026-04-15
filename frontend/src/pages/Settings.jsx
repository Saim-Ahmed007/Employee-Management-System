import { useEffect, useState } from "react";
import { dummyProfileData } from "../assets/assets";
import Loading from './../components/Loading';
import { Lock } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordModal from "../components/ChangePasswordModal";

const Settings = () => {
    const [profile, setProfile] = useState([])
    const [loading, setLoading] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const fetchProfile = async () => {
        setProfile(dummyProfileData)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    useEffect(() => {
        fetchProfile()
    },[])

    if(loading) return <Loading/>
    return (
        <div className="animate-fade-in p-8">
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-400 mt-1 mb-8">Manage your account and preferences</p>  

        {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile} />}

        <div className="border border-slate-200 rounded-md shadow-xs max-w-md p-6 flex items-center justify-between mt-8">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-lg">
                    <Lock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                    <p className="font-medium text-slate-900">Password</p>
                    <p className="text-sm text-slate-500">Update your account password</p>
                </div>
            </div>
            <button onClick={() => setShowPasswordModal(true)} className="btn-secondary text-sm">Change</button>
        </div>
        <ChangePasswordModal open={showPasswordModal} onClose={()=> setShowPasswordModal(false)}/>
        </div>
    );
};

export default Settings;