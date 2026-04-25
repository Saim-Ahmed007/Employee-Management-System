import { useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import api from "../api/axios.js"; // ✅ import api
import toast from "react-hot-toast"; // ✅ import toast

const DEPARTMENTS = ["Engineering", "IT Support", "HR", "Finance", "Marketing", "Operations"];
const STATUSES = ["ACTIVE", "INACTIVE"];

const Field = ({ label, name, type = "text", placeholder, half, as, options, form, errors, onChange }) => (
  <div className={half ? "flex-1 min-w-[45%]" : "w-full"}>
    <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
    {as === "select" ? (
      <select
        name={name} value={form[name]} onChange={onChange}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 bg-white
          ${errors[name] ? "border-red-400" : "border-slate-200"}`}
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    ) : as === "textarea" ? (
      <textarea
        name={name} value={form[name]} onChange={onChange} placeholder={placeholder} rows={3}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
      />
    ) : (
      <input
        type={type} name={name} value={form[name]} onChange={onChange} placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200
          ${errors[name] ? "border-red-400" : "border-slate-200"}`}
      />
    )}
    {errors[name] && <p className="text-xs text-red-500 mt-0.5">{errors[name]}</p>}
  </div>
);

const EditEmployeeModal = ({ employee, onClose, onSave }) => {
  const [form, setForm] = useState({
    firstName: employee.firstName ?? "",
    lastName: employee.lastName ?? "",
    email: employee.email ?? "",
    phone: employee.phone ?? "",
    department: employee.department ?? "",
    position: employee.position ?? "",
    basicSalary: employee.basicSalary ?? "",
    allowances: employee.allowances ?? "",
    deductions: employee.deductions ?? "",
    employmentStatus: employee.employmentStatus ?? "ACTIVE",
    joinDate: employee.joinDate ? employee.joinDate.split("T")[0] : "",
    bio: employee.bio ?? "",
  });
  const [preview, setPreview] = useState(employee.image ?? null);
  const [imageFile, setImageFile] = useState(null); // ✅ track actual File separately
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ✅ loading state
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);  // ✅ store real File object
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.department) e.department = "Required";
    if (!form.position.trim()) e.position = "Required";
    if (!form.basicSalary) e.basicSalary = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    // ✅ Build FormData for file + fields
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    if (imageFile) formData.append("image", imageFile); // ✅ attach real file

    try {
      setLoading(true);
      const { data } = await api.put(`/employees/${employee._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // ✅ Pass merged updated employee back to parent
      onSave({
        ...employee,
        ...form,
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances) || 0,
        deductions: Number(form.deductions) || 0,
        image: preview ?? employee.image ?? null,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Employee updated successfully!");
      onClose();
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to update employee";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Edit Employee</h2>
            <p className="text-xs text-slate-400 mt-0.5">Updating {employee.firstName} {employee.lastName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileRef.current.click()}
              className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors overflow-hidden shrink-0"
            >
              {preview
                ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
                : <Upload size={18} className="text-indigo-400" />
              }
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Profile Photo</p>
              <p className="text-xs text-slate-400">Click to change (optional)</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Field label="First Name" name="firstName" placeholder="John"  half {...fieldProps} />
            <Field label="Last Name"  name="lastName"  placeholder="Doe"   half {...fieldProps} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Field label="Email" name="email" type="email" placeholder="john@example.com" half {...fieldProps} />
            <Field label="Phone" name="phone" placeholder="9000000001"                    half {...fieldProps} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Field label="Department" name="department" as="select" options={DEPARTMENTS} half {...fieldProps} />
            <Field label="Position"   name="position"  placeholder="Software Developer"  half {...fieldProps} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Field label="Basic Salary ($)" name="basicSalary" type="number" placeholder="2000" half {...fieldProps} />
            <Field label="Allowances ($)"   name="allowances"  type="number" placeholder="200"  half {...fieldProps} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Field label="Deductions ($)" name="deductions" type="number" placeholder="50" half {...fieldProps} />
            <Field label="Join Date"      name="joinDate"   type="date"                   half {...fieldProps} />
          </div>

          <Field label="Employment Status" name="employmentStatus" as="select" options={STATUSES} {...fieldProps} />
          <Field label="Bio" name="bio" as="textarea" placeholder="Short bio (optional)" {...fieldProps} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors active:scale-[0.98] disabled:opacity-60 inline-flex items-center gap-2"
          >
            {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditEmployeeModal;