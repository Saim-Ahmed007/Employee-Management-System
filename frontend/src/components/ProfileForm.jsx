import { useState } from "react";
import { Loader2Icon, Save, User } from "lucide-react";

const ProfileForm = ({ initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-200 rounded-md shadow-xs p-6 w-full"
    >
      <h2 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
        <User className="h-5 w-5 text-slate-400" />
        Public Profile
      </h2>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0">
            {error}
          </div>
        </div>
      )}
      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0">
            {message}
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>
            <input
              className="bg-slate-50 text-slate-400 cursor-not-allowed"
              disabled
              value={`${initialData.firstName} ${initialData.lastName}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              className="bg-slate-50 text-slate-400 cursor-not-allowed"
              disabled
              value={initialData.email}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Position
            </label>
            <input
              className="bg-slate-50 text-slate-400 cursor-not-allowed"
              disabled
              value={initialData.position}
            />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
            <textarea disabled={initialData.isDeleted} name="bio" rows={5} defaultValue={initialData.bio || ""} placeholder="write a brief bio" className={`resize-none ${initialData.isDeleted ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ""}`}/>
            <p className="text-slate-400 text-xs mt-1.5">This will be displayed on your profile.</p>
        </div>
        {initialData.isDeleted ? (
            <div className="pt-2">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <p className="text-rose-600 font-medium tracking-tight">Account Deactivated</p>
                <p className="text-sm text-rose-500 mt-0.5">You can no longer update your profile.</p>
            </div>
            </div>
        ): (
            <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                    {loading ? <Loader2Icon className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                    Save Changes
                </button>

            </div>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
