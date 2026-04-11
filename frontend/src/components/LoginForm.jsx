import { useState } from "react";
import { Link } from "react-router-dom";
import LoginLeftSide from "./LoginLeftSide";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";

const LoginForm = ({ role, title, subTitle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="flex flex-1 flex-col justify-center items-center bg-white px-16">
        <div className="max-w-md w-full animate-fade-in">

          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transition-colors"
          >
            <ArrowLeftIcon size={16} /> Back to portals
          </Link>

          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-400 mb-8">{subTitle}</p>

            {
                error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )
            }
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300 transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
                {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2"/>}
              Sign in as {role}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;