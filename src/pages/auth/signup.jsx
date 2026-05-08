import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/common/loadingSpiner"; // ✅ added import

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ✅ added loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); // ✅ show spinner
    try {
      const response = await fetch("https://footware-22xr.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Signup successful! Redirecting...");
      setTimeout(() => {
        setLoading(false);
        navigate("/userHome");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again later.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info("Redirecting to Google Signup...");
    window.location.href = "/userHome"; // redirect after success
  };

  // ✅ show spinner when loading
  if (loading) {
    return <LoadingScreen title="Creating Account" subtitle="Please wait..." />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] p-4 text-[#2d2d2d]">
      <div className="w-full h-full max-w-none bg-[#fffaf0] backdrop-blur-lg text-[#2d2d2d] rounded-none shadow-none p-8 flex flex-col justify-center border border-[#e6dccf]">
        <h2 className="text-4xl font-bold text-center mb-4 text-[#3b2f2f]">
          Create Account
        </h2>
        <p className="text-center text-[#6b5e5e] mb-8 text-lg">
          Sign up to get started with your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-2xl mx-auto w-full"
        >
          <div className="text-left">
            <label className="block text-sm font-medium mb-1 text-[#3b2f2f]">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg bg-[#f5f1e6] border border-[#e6dccf] focus:border-[#d6c7b3] focus:ring focus:ring-[#d6c7b3]/50 outline-none"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium mb-1 text-[#3b2f2f]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#f5f1e6] border border-[#e6dccf] focus:border-[#d6c7b3] focus:ring focus:ring-[#d6c7b3]/50 outline-none"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative text-left">
            <label className="block text-sm font-medium mb-1 text-[#3b2f2f]">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-[#f5f1e6] border border-[#e6dccf] focus:border-[#d6c7b3] focus:ring focus:ring-[#d6c7b3]/50 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative text-left">
            <label className="block text-sm font-medium mb-1 text-[#3b2f2f]">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-[#f5f1e6] border border-[#e6dccf] focus:border-[#d6c7b3] focus:ring focus:ring-[#d6c7b3]/50 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition"
          >
            Sign Up
          </button>

          <div className="flex items-center gap-2 my-6">
            <div className="flex-1 h-px bg-[#e6dccf]"></div>
            <span className="text-[#6b5e5e] text-sm">OR</span>
            <div className="flex-1 h-px bg-[#e6dccf]"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#f5f1e6] text-amber-50 hover:bg-[#e6dccf] border border-[#e6dccf] rounded-lg transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
            Sign up with Google
          </button>
        </form>

        <p className="text-center text-base text-[#6b5e5e] mt-8">
          Already have an account?{" "}
          <a href="/login" className="text-black hover:underline">
            Login
          </a>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
