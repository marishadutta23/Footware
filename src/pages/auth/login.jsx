import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/common/loadingSpiner";
 // ✅ Import your spinner
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Spinner state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await fetch("https://footware-22xr.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE 👉", data);

    if (!response.ok) {
      toast.error(data.message || "Invalid email or password");
      setLoading(false);
      return;
    }

if (data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({
  _id: data._id,
  fullName: data.fullName,
  email: data.email,
  role: data.role
}));

      toast.success("Login successful!");
      setTimeout(() => {
        setLoading(false);
        data.role === "admin"
          ? navigate("/home")
          : navigate("/userHome");
      }, 1000);
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong. Please try again.");
    setLoading(false);
  }
};


  // ✅ Show spinner while loading
  if (loading) {
  return <LoadingScreen title="Logging In" subtitle="Please wait..." />;
}





  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] px-4 py-8 text-[#2d2d2d]">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="w-full max-w-lg bg-[#fffaf0] rounded-2xl shadow-2xl p-10 border border-[#e6dccf]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-[#6b5e5e] mt-2 text-base">
            Login to continue to your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="text-left">
            <label className="block text-sm font-medium text-[#3b2f2f] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-[#fdf6e3] text-[#2d2d2d] rounded-lg border border-[#d6c7b3] focus:outline-none focus:ring-2 focus:ring-[#8b5e3c] focus:border-[#8b5e3c]"
              required
            />
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="block text-sm font-medium text-[#3b2f2f] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-[#fdf6e3] text-[#2d2d2d] rounded-lg border border-[#d6c7b3] focus:outline-none focus:ring-2 focus:ring-[#8b5e3c] focus:border-[#8b5e3c]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-2 right-3 flex items-center text-[#6b5e5e] hover:text-[#8b5e3c]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#6b5e5e]">
              <input
                type="checkbox"
                className="form-checkbox rounded bg-[#f5f1e5] border-[#d6c7b3] text-[#3b2f2f] focus:ring-[#8b5e3c]"
              />
              Remember me
            </label>
            <Link to="/forgotPassword" className="text-[#3b2f2f] hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg shadow-lg transition-colors"
          >
            <LogIn className="w-5 h-5" /> Login
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-[#d6c7b3]"></div>
            <span className="px-3 text-[#6b5e5e] text-sm">OR</span>
            <div className="flex-grow h-px bg-[#d6c7b3]"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white text-[#3b2f2f] font-medium rounded-lg shadow hover:bg-[#f5f1e6] transition-colors border border-[#e6dccf]"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_10_250)">
                <path
                  d="M23.75 12.27C23.75 11.45 23.68 10.63 23.54 9.82H12V14.47H18.47C18.17 16.27 17.15 17.84 15.65 18.88V22.25H19.72C22.19 20.09 23.75 16.89 23.75 12.27Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 24C15.24 24 17.98 22.95 19.97 21.25L15.91 17.91C14.71 18.66 13.31 19.11 12 19.11C9.09 19.11 6.64 17.16 5.76 14.47H1.67V17.85C3.55 21.5 7.42 24 12 24Z"
                  fill="#34A853"
                />
                <path
                  d="M5.76 14.47C5.54 13.82 5.42 13.11 5.42 12.42C5.42 11.73 5.54 11.02 5.76 10.37V6.99H1.67C0.8 8.65 0.33 10.49 0.33 12.42C0.33 14.35 0.8 16.19 1.67 17.85L5.76 14.47Z"
                  fill="#FBBC04"
                />
                <path
                  d="M12 4.9C13.6 4.9 14.99 5.48 16.15 6.51L19.92 2.74C17.98 1.05 15.24 0 12 0C7.42 0 3.55 2.5 1.67 6.15L5.76 9.53C6.64 6.84 9.09 4.9 12 4.9Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_10_250">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Login with Google
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#6b5e5e] text-sm mt-8">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#3b2f2f] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
