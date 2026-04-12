import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData } from "../assets/assets";
import Loading from "../components/Loading";
import { Search, Plus, ChevronDown, Pencil, Trash2 } from "lucide-react";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";

const getInitials = (firstName, lastName) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const initials = getInitials(employee.firstName, employee.lastName);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
      {/* Department badge */}
      <div className="px-4 pt-4 pb-8 bg-slate-100 relative">
        <span className="text-xs text-slate-500 border border-slate-200 rounded-md px-2 py-0.5 bg-white">
          {employee.department}
        </span>

        {/* Edit & Delete — visible on hover */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(employee);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
            title="Edit employee"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(employee);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-300 transition-colors"
            title="Delete employee"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Avatar overlapping the two sections */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          {employee.image ? (
            <img
              src={employee.image}
              alt={employee.firstName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center">
              <span className="text-xl font-medium text-indigo-400">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-5 pt-12 text-center">
        <p className="text-sm font-semibold text-slate-800">
          {employee.firstName} {employee.lastName}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{employee.position}</p>
      </div>
    </div>
  );
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [deptOpen, setDeptOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setEmployees(dummyEmployeeData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

   const handleAdd = (newEmployee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
  };

  const handleSave = (updatedEmployee) => {
  setEmployees(prev =>
    prev.map(e => e._id === updatedEmployee._id ? updatedEmployee : e)
  );
};

  const handleDelete = (employee) => {
    if (window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) {
      setEmployees((prev) => prev.filter((e) => e._id !== employee._id));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees();
  }, [fetchEmployees]);

  const departments = [
    "All Departments",
    ...new Set(dummyEmployeeData.map((e) => e.department)),
  ];

  const filtered = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      selectedDept === "All Departments" || e.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  if (loading) return <Loading />;
  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-8">
        {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
            {editingEmployee && (
            <EditEmployeeModal
                employee={editingEmployee}
                onClose={() => setEditingEmployee(null)}
                onSave={handleSave}
            />
            )}
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Employees</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your team members
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all">
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
        {/* Search */}
        <div className="flex w-full items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none"
          />
        </div>

        {/* Department Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDeptOpen((prev) => !prev)}
            className="flex items-center justify-between gap-8 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 min-w-55 md:min-h-15.5"
          >
            {selectedDept}
            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform ${deptOpen ? "rotate-180" : ""}`}
            />
          </button>

          {deptOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDept(dept);
                    setDeptOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors
              ${
                selectedDept === dept
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Employee Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-16 text-sm">
          No employees found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Employees;
