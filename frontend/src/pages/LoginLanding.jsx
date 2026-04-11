import { Link } from "react-router-dom";
import LoginLeftSide from "../components/LoginLeftSide";
import { ArrowRightIcon, ShieldIcon, UserIcon } from "lucide-react";

const LoginLanding = () => {
  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      description:
        "Manage employees, departments, payroll and system configuration.",
      icon: ShieldIcon,
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      description:
        "View your profile track attendence request time off and access payslips.",
      icon: UserIcon,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <div className="flex flex-1 flex-col justify-center items-center min-h-screen bg-white px-16">
        <div className="max-w-sm w-full">
          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Select your portal to securely access the system.
          </p>

          {/* Employee Portal Button */}
          <div className="space-y-4">
            {portalOptions.map((portal) => (
              <Link
                key={portal.to}
                to={portal.to}
                className="w-full flex items-center justify-between px-5 py-4 mb-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-6">
                  <div className="p-2 bg-white border border-gray-200 rounded-md">
                    <portal.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-md font-medium text-gray-800">
                      {portal.title}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                  <ArrowRightIcon/>
                </span>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-10">
            © {new Date().getFullYear()} Saim Ahmed. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLanding;
