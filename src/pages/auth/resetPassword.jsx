import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
  const { token } = useParams();
const navigate = useNavigate();

  const checkStrength = (value) => {
    setPassword(value);
    if (!value) {
      setStrength("");
      return;
    }
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    if (strongRegex.test(value)) {
      setStrength("Strong");
    } else if (mediumRegex.test(value)) {
      setStrength("Medium");
    } else {
      setStrength("Weak");
    }
  };

  const getStrengthColor = () => {
    if (strength === "Strong") return "text-green-600";
    if (strength === "Medium") return "text-yellow-600";
    if (strength === "Weak") return "text-red-600";
    return "text-gray-500";
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!password || !confirmPassword) {
    setError("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      `https://footware-22xr.onrender.com/api/auth/reset-password/${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] p-4 text-[#2d2d2d] relative">
      <div className="w-full max-w-lg p-10 rounded-2xl shadow-2xl bg-[#fffaf0] backdrop-blur-lg text-[#2d2d2d] border border-[#e6dccf]">
        <h2 className="text-3xl font-bold text-center mb-2 text-[#3b2f2f]">Reset Password</h2>
        <p className="text-center text-[#6b5e5e] mb-8">
          Enter your new password below to reset your account.
        </p>
        {error && (
  <div className="mb-4 bg-red-100 text-red-600 p-3 rounded text-sm">
    {error}
  </div>
)}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative text-left">
            <label className="block text-sm font-medium mb-1 text-[#3b2f2f]">New Password</label>
<input
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => checkStrength(e.target.value)}
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
            {strength && (
              <p className={`mt-2 text-sm font-medium ${getStrengthColor()}`}>
                Password Strength: {strength}
              </p>
            )}
          </div>

          <div className="relative text-left">
            <label className="block text-sm font-medium mb-1 text-[#3b2f2f]">Confirm Password</label>
<input
  type={showConfirmPassword ? "text" : "password"}
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  placeholder="********"
  className="w-full px-4 py-3 rounded-lg bg-[#f5f1e6] border border-[#e6dccf] focus:border-[#d6c7b3] focus:ring focus:ring-[#d6c7b3]/50 outline-none pr-10"
/>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

<button
  type="submit"
  disabled={loading}
  className="w-full py-3 px-4 bg-black hover:bg-gray-800 rounded-lg font-semibold transition text-lg text-white"
>
  {loading ? "Resetting..." : "Reset Password"}
</button>
        </form>

        <p className="text-center text-sm text-[#6b5e5e] mt-8">
          Remembered your password?{" "}
          <a href="/login" className="text-black hover:underline">
            Go back to Login
          </a>
        </p>
      </div>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl text-center w-80 animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Password Reset Successful</h3>
            <p className="text-gray-600 mb-4">You can now log in with your new password.</p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}